import React, { useState, useEffect } from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import TabPanel from "./TabPanel";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

function ReusableTabs({ tabsConfig, initialTab }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize the active tab state with the value from the URL or the initialTab prop
  const [value, setValue] = useState(0);

  useEffect(() => {
    const getTabFromUrl = () => {
      const searchParams = new URLSearchParams(location.search);
      const tabParam = searchParams.get("tab");
      const tabValue = parseInt(tabParam, 10);
      if (!isNaN(tabValue) && tabValue >= 0 && tabValue < tabsConfig.length) {
        return tabValue;
      }
      return initialTab || 0; // Default to initialTab or the 1st tab if URL param is invalid
    };

    // Set the tab based on the URL or the initialTab prop
    setValue(getTabFromUrl());
  }, [location.search, tabsConfig.length, initialTab]); // Depend on location.search, tabsConfig.length, and initialTab


  // Handles changing the active tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Update the URL to include the selected tab index as a query parameter
    navigate(`?tab=${newValue}`, { replace: true });
  };


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
          variant="scrollable"
          scrollButtons="auto"
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
                color: value === index ? theme.palette.warning.light : '#0A0A0A',
                flex: 1,
                '&.Mui-selected': { color: theme.palette.warning.light },
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

