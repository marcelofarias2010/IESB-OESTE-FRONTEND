import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

console.log("oi");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
