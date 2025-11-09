import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "@shared/styles/scss/main.scss";
import "@shared/config/i18n/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
