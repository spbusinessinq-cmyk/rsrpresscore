import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const PgSession = connectPgSimple(session);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.warn(
    "[app] WARNING: SESSION_SECRET is not set. " +
    "Sessions will not persist across restarts. Set SESSION_SECRET in production."
  );
}

const resolvedSecret = sessionSecret ?? "dev-fallback-secret-not-for-production";

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      errorLog: (err: Error) => {
        console.error("[session-store] Error:", err.message);
      },
    }),
    secret: resolvedSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: (process.env.COOKIE_SAME_SITE as "strict" | "lax" | "none") ??
        (process.env.NODE_ENV === "production" ? "none" : "lax"),
    },
  }),
);

app.use("/api", router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error("[app] Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV !== "production" ? err.message : undefined,
  });
});

export default app;
