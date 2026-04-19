import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";

// When VITE_API_BASE_URL is set (e.g. for EdgeOne Pages where the frontend
// and API server run on different origins), prepend it to every /api/* call.
// Leave unset for same-origin deployments where nginx proxies /api/*.
const apiBase = import.meta.env.VITE_API_BASE_URL;
if (apiBase) {
  setBaseUrl(apiBase);
}

createRoot(document.getElementById("root")!).render(<App />);
