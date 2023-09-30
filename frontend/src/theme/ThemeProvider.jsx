import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createBettingAppTheme } from "./theme";


function ThemeWrapper({ children }) {

  const theme = createBettingAppTheme(); // Create your custom theme here

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ThemeWrapper;