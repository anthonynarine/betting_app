import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CssBaseline, useMediaQuery, createTheme } from "@mui/material";
import Cookies from "js-cookie";
import { ColorModeContext } from "../context/ColorModeContext";
import ThemeWrapper from "../theme/ThemeProvider";

const ToggleColorModeProvider = ({ children }) => {
  // Determine the user's system color scheme preference
  const prefersDarkMode = useMediaQuery("([prefers-color-scheme: dark])");

  // Initialize the color mode based on cookies or user preference
  const [mode, setMode] = useState(() => {
    const storedMode = Cookies.get("colorMode");
    return storedMode || (prefersDarkMode ? "dark" : "light");
  });

  // Toggle the color mode between "light" and "dark"
  const toggleColorMode = useCallback(() => {
    const newMode = mode === "light" ? "dark" : "light";
    Cookies.set("colorMode", newMode);
    setMode(newMode);
  }, [mode]);

  // Create a memoized context value with the toggleColorMode function
  const colorMode = useMemo(() => ({ toggleColorMode }), [toggleColorMode]);

  // Create a memoized theme based on the current mode
  const theme = useMemo(() => createTheme(mode || "light"), [mode]);

  // Update the "colorMode" cookie whenever the mode changes
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

