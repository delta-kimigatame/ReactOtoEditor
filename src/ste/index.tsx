import * as React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ErrorBoundary } from "react-error-boundary";

import { SteApp } from "./SteApp";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={null}>
      <ThemeProvider theme={createTheme()}>
        <CssBaseline />
        <SteApp />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);