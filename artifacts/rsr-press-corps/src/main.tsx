import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";

window.onerror = (msg, src, line, col, err) => {
  console.error("[RSR] Global error:", { msg, src, line, col, err });
};

window.onunhandledrejection = (event) => {
  console.error("[RSR] Unhandled promise rejection:", event.reason);
};

const apiBase = import.meta.env.VITE_API_BASE_URL;
if (apiBase) {
  setBaseUrl(apiBase);
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("[RSR] Fatal: #root element not found in document.");
} else {
  createRoot(rootEl).render(<App />);
}
