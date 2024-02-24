import GroupsList from '../group/GroupsList';
import ReusableTabs from '../../components/tabs/ReusableTabs';
import BetList from '../events/bets/BetList';
import UserEvents from '../events/userEvents/UserEvents';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function HomeTabs() {
  const location = useLocation();

// State hook for managing the initial active tab.
// This state is initialized to 0, meaning the first tab is active by default.
const [initialTab, setInitialTab] = useState(0);

// useEffect hook to run side effects in your component.
// In this case, the side effect is reading the URL's query parameters to set the initial tab.
useEffect(() => {
  // Create a URLSearchParams object from the current URL's search string
  // This object provides convenient methods to work with the query string of a URL
  const searchParams = new URLSearchParams(location.search);

  // Get the 'tab' query parameter from the URL, if it exists
  const tabParam = searchParams.get('tab');

  // Check if the 'tab' query parameter is present
  if (tabParam) {
    // Parse the 'tab' parameter value to an integer to get the tab index
    const tabIndex = parseInt(tabParam, 10);

    // Check if the parsed tab index is a valid number and non-negative
    // This validation ensures we only set the initial tab state with valid indices
    if (!isNaN(tabIndex) && tabIndex >= 0) {
      // Update the initialTab state with the parsed tab index
      // This will make the corresponding tab active when the component mounts or the URL changes
      setInitialTab(tabIndex);
    }
  }
  // The useEffect hook depends on the 'location' object.
  // This means the hook will re-run whenever the 'location' object changes,
  // such as when navigating to a different URL.
}, [location.search]);


  const tabsConfig = [
    {
      label: "Groups",
      content: <GroupsList />, 
    },
    {
      label: "My Bets",
      content: <BetList />,
    },
    {
      label: "Popular Events",
      content: <Typography variant='h1'>"UNDER CONSTRUCTION"</Typography>, 
    },
    {
      label: "My Event",
      content: <UserEvents />, 
    },
    // Add more tabs if needed
  ];

  return <ReusableTabs tabsConfig={tabsConfig} initialTab={initialTab} />;
}





