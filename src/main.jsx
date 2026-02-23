import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import JeopardyGame from "./jeopardy.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <JeopardyGame />
  </StrictMode>
);
