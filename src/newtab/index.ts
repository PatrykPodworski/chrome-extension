import React from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { App } from "./App";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(App));
  } else {
    console.error("Root container not found");
  }
});
