import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import NewTab from "./components/NewTab";

// Initialize React app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(NewTab));
  }
});
