import React, { useState } from 'react';
import GroupListCard from "../main/GroupListCard";
import ReusableTabs from '../../../components/tabs/ReusableTabs';
import BetList from '../../events/bets/BetList';



export default function HomeTabs() {
  const tabsConfig = [
    {
      label: "Groups",
      content: <GroupListCard />, 
    },
    {
      label: "My Bets",
      content: <BetList open={true} />,
    },
    {
      label: "Popular Events",
      content: <BetList open={true} />, 
    },
    // Add more tabs if needed
  ];

  return <ReusableTabs tabsConfig={tabsConfig} />;
}





