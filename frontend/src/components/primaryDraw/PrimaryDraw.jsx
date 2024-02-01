import { Box, useMediaQuery, Typography, styled } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import DrawerToggle from "./DrawToggle";

function PrimaryDraw({ children }) {
  const theme = useTheme();
  const below600 = useMediaQuery("(max-width:599px)");
  const [open, setOpen] = useState(!below600);

  // Mixin for styles when the drawer is open
  const openedMixin = () => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: "auto", // Enables scroll when the content overflows
  });

  // Mixin for styles when the drawer is closed
  const closedMixin = () => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: "auto", // Enables scroll when the content overflows
    width: theme.primaryDraw.closed, // Sets the width of the closed drawer
  });

  // Custom styled Drawer component
  const CustomDrawer = styled(MuiDrawer)(({ theme, open }) => ({
    width: theme.primaryDraw.width, // Sets the default width of the drawer
    whiteSpace: "nowrap", // Prevents text from wrapping
    boxSizing: "border-box", // Ensures padding and border are included in the width calculation

    // Styles applied when the drawer is open
    ...(open && {
      ...openedMixin(),
      "& .MuiDrawer-paper": openedMixin(), // Applies the openedMixin to the Drawer's paper component
    }),

    // Styles applied when the drawer is closed
    ...(!open && {
      ...closedMixin(),
      "& .MuiDrawer-paper": closedMixin(), // Applies the closedMixin to the Drawer's paper component
    }),
  }));
  // console.log(below600);

  useEffect(() => {
    setOpen(!below600);
  }, [below600]);

  //see why these handlerfunctions were created this way NOTES below
  const openDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const childrenWithProps = React.Children.map(children, (child) =>
    /* this code is iterating 
    over all the children of a component. For each child 
    that is a valid React element, it clones the element and
    injects the open prop into it. If the child is not a valid 
  React element, it just passes it through unchanged.*/
    React.isValidElement(child) ? React.cloneElement(child, { open }) : child
  );

  return (
    <CustomDrawer
      open={open}
      variant={below600 ? "temporary" : "permanent"}
      PaperProps={{
        sx: {
          mt: `${theme.primaryAppBar.height}px`,
          height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
          width: theme.primaryDraw.width,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 0,
            width: open ? "auto" : "100%",
          }}
        >
          <DrawerToggle open={open} closeDrawer={closeDrawer} openDrawer={openDrawer} />
          {/* {[...Array(100)].map((_, i) => (
            <Typography key={i} paragraph>
              {i + 1}
            </Typography>
          ))} */}
        </Box>
        {childrenWithProps}
      </Box>
    </CustomDrawer>
  );
}

export default PrimaryDraw;

////   useCallback notes
/* What we did here is wrap each function with useCallback,
 and provided an array of dependencies. Since these functions
 don't depend on any external variables, we've provided an empty 
 array []. This means the functions will retain their identity 
unless something in that dependency array changes (which in this 
case, won't happen because it's empty).

By doing this, the functions won't get re-created 
with every render, which can be beneficial for performance,
 especially if these functions are passed to child components or
used in effects with these functions as dependencies. */
