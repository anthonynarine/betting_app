import React, { useState, useMemo, useCallback } from "react";
import { CssBaseline, useMediaQuery, createTheme } from "@mui/material";
import { ColorModeContext } from "../context/ColorModeContext";
import ThemeWrapper from "../theme/ThemeProvider";

const ToggleColorModeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState(() => {
    const storedColorMode = localStorage.getItem("colorMode");
    if (storedColorMode === "light" || storedColorMode === "dark") {
      return storedColorMode;
    }
    return prefersDarkMode ? "dark" : "light";
  });

  const toggleColorMode = useCallback(() => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("colorMode", newMode);
    setMode(newMode);
  }, [mode]);

  const colorMode = useMemo(() => ({ toggleColorMode }), [toggleColorMode]);

  const theme = useMemo(() => createTheme(mode), [mode]);

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


//                useMomo
/* The useMemo hook in React is used to memoize (cache)
 the result of a function or an expression so that it
is only recalculated when the dependencies specified
 in its dependency array change. */
