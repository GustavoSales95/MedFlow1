import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Router from "./app/routes";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./app/theme/theme";
import { AppProvider } from "./app/shared/contexts/AppContext"; // 🔥 não esqueça do import!
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={Router} />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
