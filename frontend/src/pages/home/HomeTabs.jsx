import GroupsList from '../group/GroupsList';
import ReusableTabs from '../../components/tabs/ReusableTabs';
import BetList from '../events/bets/BetList';
import UserEvents from '../events/userEvents/UserEvents';
import { Typography } from '@mui/material';


export default function HomeTabs() {
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

  return <ReusableTabs tabsConfig={tabsConfig} />;
}





