import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import PageHeader from "./header/PageHeader";

import React, { useEffect } from "react";
import { EventDataProvider } from "../../context/eventData/EventDataProvider";
import GroupTabs from "./GroupTabs";
import EventList from "./EventList";
import { useParams } from "react-router-dom";


const GroupPage = () => {
    const { groupId } = useParams();
  //EASER EGG
  useEffect(() => {
    console.log(
      "👋 😂 I used to play sports. Then I realized you can buy trophies. Now I'm good at everything. - Demetri Martin 🏆🌟"
    );
  }, []);

  return (
      <EventDataProvider>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center" }}>
          <CssBaseline />
          <PrimaryAppBar />
          <GroupTabs />
          <PageHeader />
          <EventList />
        </Box>
      </EventDataProvider>
  );
};

export default GroupPage;