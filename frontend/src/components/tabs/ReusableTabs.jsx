/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import TabPanel from "./TabPanel";
import { useTheme } from "@mui/material/styles";

/**
 * "ReusableTabs" renders a set of tabs and corresponding content panel
 * @param {object[]} tabsConfig An array of object describing each tab and it's contents
 * Each object in the arry must have a "label" (string) for the tab label and `content` (React node) for the tab content.
 */

function ReusableTabs({ tabsConfig }) {
  let theme = useTheme();

  // State hook for manageing the active tab.  "value" is the index of the currently active tab
  let [value, setValue] = useState(0);

  // Handles changing the active tab. 
  let handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    // Box is the container for the tabs
    <Box
      sx={{
        width: "100%",
        pt: `${theme.primaryAppBar.height}px`,
        bgcolor: theme.palette.background.default,
      }}
    >  
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
        }}
      > 
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            ".MuiTabs-flexContainer": {
              justifyContent: "space-evenly",
            },
            ".MuiTabs-indicator": {
              backgroundColor: theme.palette.secondary.main, // Indicator color
            },
            ".MuiTab-root": { // Apply default styles to all tabs
              color: theme.palette.primary.light, // Default color for inactive tabs
              '&.Mui-selected': { // Increase specificity for selected tab
                color: theme.palette.primary.contrastText, // Active tab color
              },
            },
          }}
        >
          // Map over the tabsConfig array to render a Tab for each item
          {tabsConfig.map((tab, index) => (
            <Tab
              label={tab.label}
              key={index}
              onClick={event => {
                // Prevent the default tab change behavior if there's a custom onClick handler
                if (tab.onClick) {
                  event.stopPropagation();
                  tab.onClick();
                } else {
                  // Default behavior: Change tabs
                  handleChange(event, index);
                }
              }}
              sx={{
                color: value === index ? theme.palette.primary.contrastText : '#0A0A0A', // Adjusted for active/inactive tab colors
                flex: 1, // Makes each tab flex equally
                '&.Mui-selected': { // Ensures that the selected tab has the contrast text color
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      {tabsConfig.map((tab, index) => (
        <TabPanel value={value} index={index} key={index} dir={theme.direction}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}

export default ReusableTabs;
