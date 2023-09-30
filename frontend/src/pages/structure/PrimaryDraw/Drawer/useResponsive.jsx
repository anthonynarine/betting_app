import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Custom hook for handling responsive drawer visibility.
 * Automatically closes the drawer on small screens when it's open.
 *
 * @returns {Object} An object containing `isDrawerVisible` and `toggleDrawer` functions.
 */
export function useResponsiveDrawer() {
  // State to track the drawer visibility
  const [isDrawerVisible, setDrawerVisibility] = useState(false);

  const theme = useTheme();

  // Check if the screen is small (up to "sm" breakpoint)
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  // Effect to handle drawer visibility on small screens
  useEffect(() => {
    // If the screen is small and the drawer is visible, close the drawer
    if (isSmallScreen && isDrawerVisible) {
      setDrawerVisibility(false);
    }
  }, [isSmallScreen, isDrawerVisible]);

  /**
   * Function to toggle the drawer visibility.
   * @param {boolean} visible - Whether the drawer should be visible or not.
   */
  const toggleDrawer = (open) => () => {
    setDrawerVisibility(open);
  };


  return { isDrawerVisible, toggleDrawer };
}
