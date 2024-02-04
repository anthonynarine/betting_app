import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GroupListCard from "../main/GroupListCard";
import ReusableTabs from '../../../components/tabs/ReusableTabs';



export default function HomeTabs() {
  const tabsConfig = [
    {
      label: "Groups",
      content: <GroupListCard />, // Your component for "Groups" tab
    },
    {
      label: "My Bets",
      content: <div>All Bets content goes here</div>, // Replace with actual component/content for "All Bets" tab
    },
    {
      label: "Popular Events",
      content: <div>Popular Events content goes here</div>, // Replace with actual component/content for "Popular Events" tab
    },
    // Add more tabs if needed
  ];

  return <ReusableTabs tabsConfig={tabsConfig} />;
}

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`full-width-tabpanel-${index}`}
//       aria-labelledby={`full-width-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3, bgcolor: 'background.default' }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `full-width-tab-${index}`,
//     'aria-controls': `full-width-tabpanel-${index}`,
//   };
// }

// export default function HomeTabs() {
//   const theme = useTheme();
//   const [value, setValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ width: '100%', pt: `${theme.primaryAppBar.height}px`, bgcolor: '#121212' }}> 
//       <AppBar position="static" sx={{ backgroundColor: '#0A0A0A', color: '#FFC0CB' }}> 
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           indicatorColor="secondary" // Consider customizing this color if needed
//           textColor="inherit"
//           variant="fullWidth"
//           aria-label="full width tabs example"
//           sx={{
//             '.MuiTabs-indicator': { backgroundColor: '#D81B60' }, 
//           }}
//         >
//           <Tab label="Groups" {...a11yProps(0)} sx={{ color: '#FFF' }} />
//           <Tab label="All Bets" {...a11yProps(1)} sx={{ color: '#FFF' }} />
//           <Tab label="Popular Events" {...a11yProps(2)} sx={{ color: '#FFF' }} />
//         </Tabs>
//       </AppBar>
//       <TabPanel value={value} index={0} dir={theme.direction}>
//       <GroupListCard />
//       </TabPanel>
//       <TabPanel value={value} index={1} dir={theme.direction}>
      
//       </TabPanel>
//       <TabPanel value={value} index={2} dir={theme.direction}>
//         Item Three
//       </TabPanel>
//     </Box>
//   );
// }





