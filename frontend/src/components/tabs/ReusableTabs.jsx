import React, { useState, useEffect } from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import TabPanel from "./TabPanel";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function ReusableTabs({ tabsConfig, initialTab }) {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Initialize the active tab state with initialTab prop, if provided
  const [value, setValue] = useState(initialTab || 0);

  // Handles changing the active tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Update the URL to include the selected tab index as a query parameter
    navigate(`?tab=${newValue}`, { replace: true });
  };

  useEffect(() => {
    setValue(initialTab);
  }, [initialTab]);

  return (
    <Box
      sx={{
        width: "100%",
        pt: `${theme.primaryAppBar.height}px`,
        bgcolor: theme.palette.background.default,
      }}
    >  
      <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.dark, color: theme.palette.primary.contrastText }}>
        <Tabs
          value={value}
          onChange={handleChange}
          // variant="scrollable"
          // scrollButtons="auto"
          sx={{
            ".MuiTabs-flexContainer": { justifyContent: "space-evenly" },
            ".MuiTabs-indicator": { backgroundColor: theme.palette.secondary.main },
            ".MuiTab-root": {
              color: theme.palette.primary.light,
              '&.Mui-selected': { color: theme.palette.primary.contrastText },
            },
          }}
        >
          {tabsConfig.map((tab, index) => (
            <Tab
              label={tab.label}
              key={index}
              onClick={(event) => {
                if (tab.onClick) {
                  event.stopPropagation();
                  tab.onClick();
                }
              }}
              sx={{
                color: value === index ? theme.palette.primary.contrastText : '#0A0A0A',
                flex: 1,
                '&.Mui-selected': { color: theme.palette.primary.contrastText },
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

