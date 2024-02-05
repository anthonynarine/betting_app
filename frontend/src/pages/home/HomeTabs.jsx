import React, { useState } from 'react';
import GroupListCard from "./main/GroupListCard";
import GroupsList from './GroupsList';
import ReusableTabs from '../../components/tabs/ReusableTabs';
import BetList from '../events/bets/BetList';
import { Typography } from '@mui/material';



export default function HomeTabs() {
  const tabsConfig = [
    {
      label: "Groups",
      content: <GroupsList />, 
    },
    {
      label: "My Bets",
      content: <BetList open={true} />,
    },
    {
      label: "Popular Events",
      content: <Typography variant='h1'>"UNDER CONSTRUCTION"</Typography>, 
    },
    // Add more tabs if needed
  ];

  return <ReusableTabs tabsConfig={tabsConfig} />;
}





