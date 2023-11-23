import React from "react";

// Type definition for the color mode context
// Defines a `toggleColorMode` function for toggling the color mode
const ColorModeContextProps = {
  /**
   * Function to toggle the color mode.
   * This function should be implemented in the Provider value.
   * By default, it does nothing.
   */
  toggleColorMode: () => {},
};

// Creates a new context for managing the color mode
// The default context includes a `toggleColorMode` function which does nothing
export const ColorModeContext = React.createContext(ColorModeContextProps);
