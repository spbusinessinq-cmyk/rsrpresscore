# ─────────────────────────────────────────────────────────────────────────────
# RSR Press Corps — Multi-stage Dockerfile
#
# Targets:
#   api   — Express.js API server (Node.js runtime)
#   web   — nginx serving the React SPA + proxying /api to the api service
#
# Usage with docker-compose (recommended):
#   docker compose build
#   docker compose up
#
# Build individual targets:
#   docker build --target api -t rsr-api .
#   docker build --target web -t rsr-web .
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Builder ─────────────────────────────────────────────────────────
# Must use glibc-based Node (Debian/slim), NOT Alpine.
# pnpm-workspace.yaml excludes the musl esbuild variant, which Alpine requires.
FROM node:22-slim AS builder

# Install pnpm
ENV PNPM_HOME=/usr/local/bin
RUN npm install -g pnpm@latest --ignore-scripts

WORKDIR /app

# Copy workspace manifests first (layer caching — only reinstall when these change)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Copy all package.json files so pnpm can resolve the workspace graph
COPY artifacts/api-server/package.json        ./artifacts/api-server/
COPY artifacts/rsr-press-corps/package.json   ./artifacts/rsr-press-corps/
COPY lib/db/package.json                      ./lib/db/
COPY lib/api-client-react/package.json        ./lib/api-client-react/
COPY lib/api-spec/package.json                ./lib/api-spec/
COPY lib/api-zod/package.json                 ./lib/api-zod/

# Install ALL workspace dependencies (dev + prod needed for build)
RUN pnpm install --frozen-lockfile

# Copy the full source
COPY . .

# ── Build API server (esbuild → dist/index.mjs) ──────────────────────────────
RUN pnpm --filter @workspace/api-server run build

# ── Build React frontend (Vite → dist/public/) ───────────────────────────────
# vite.config.ts requires PORT and BASE_PATH at config-eval time.
# PORT is only used for `vite preview`; during `vite build` it is inert.
# BASE_PATH=/ means the app is served from the root of its origin.
ENV PORT=3000
ENV BASE_PATH=/
RUN pnpm --filter @workspace/rsr-press-corps run build


# ── Stage 2: API runtime ─────────────────────────────────────────────────────
FROM node:22-slim AS api

WORKDIR /app

# Copy the bundled API server output
COPY --from=builder /app/artifacts/api-server/dist ./dist

# pino uses worker threads that are resolved at runtime — copy node_modules
# only from the api-server package (esbuild bundles all other deps inline)
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]


# ── Stage 3: Web (nginx + static frontend) ───────────────────────────────────
FROM nginx:1.27-alpine AS web

# Copy the built Vite SPA
COPY --from=builder /app/artifacts/rsr-press-corps/dist/public /usr/share/nginx/html

# Copy the production nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
