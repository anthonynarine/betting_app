import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CssBaseline, useMediaQuery, createTheme } from "@mui/material";
import Cookies from "js-cookie";
import { ColorModeContext } from "../context/ColorModeContext";
import ThemeWrapper from "../theme/ThemeProvider";

const ToggleColorModeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("([prefers-color-scheme: dark])");

  console.log("Before useState initialization");
  const [mode, setMode] = useState(() => {
    const colorMode = Cookies.get("colorMode");
    console.log("Color mode from cookies:", colorMode);
    return colorMode || (prefersDarkMode ? "dark" : "light");
  });
  console.log("After useState initialization");

  const toggleColorMode = useCallback(() => {
    // Invert the current mode
    const newMode = mode === "light" ? "dark" : "light";
    // Store the new mode in cookies
    Cookies.set("colorMode", newMode);
    // Update the color mode state
    setMode(newMode);
  }, [mode]);

  const colorMode = useMemo(() => ({ toggleColorMode }), [toggleColorMode]);

  const theme = useMemo(() => createTheme(mode || "light"), [mode]);

  useEffect(() => {
    Cookies.set("colorMode", mode);
    console.log(`Color mode switched to: ${mode}`);
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeWrapper theme={theme}>
        <CssBaseline />
        {children}
      </ThemeWrapper>
    </ColorModeContext.Provider>
  );
};

export default ToggleColorModeProvider;
