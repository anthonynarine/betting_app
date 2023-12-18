import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const SecondaryDraw = ({ children }) => {
  const theme = useTheme();


  // Style for handling text overflow
  const overflowStyle = {
    textOverflow: "ellipsis", // Add ellipsis at the end of the text
    overflow: "hidden",      // Hide overflow text
    whiteSpace: "nowrap",    // Prevent text from wrapping to the next line
    maxWidth: "28ch",        // Set maximum width based on character count
  };

  const childrenWithProps = React.Children.map(children, (child) =>
  /* this code is iterating 
  over all the children of a component. For each child 
  that is a valid React element, it clones the element and
  injects the open prop into it. If the child is not a valid 
React element, it just passes it through unchanged.*/
  React.isValidElement(child) ? React.cloneElement(child) : child
);

  return (
    <>
      <Box
        sx={{
          minWidth: `${theme.secondaryDraw.width}px`,
          height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
          mt: `${theme.primaryAppBar.height}px`,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: { xs: "none", sm: "block" }, 
          overflow: "auto",
        }}
      >
                  {/* {[...Array(100)].map((_, i) => (
            <Typography key={i} paragraph>
              {i + 1}
            </Typography>
          ))} */}
          {childrenWithProps}
      </Box>
    </>
  );
};
export default SecondaryDraw;
