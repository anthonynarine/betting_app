import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/Drawer/PrimaryDraw";
import Main from "../structure/Main/Main";

import GroupMembers from "./primayrDraw/GroupMembers";
import EventsList from "./secondaryDraw/EventsList";
import SecondarDraw from "../structure/SecondaryDraw/SecondaryDraw";
import GroupDetails from "./main/GroupDetails";

import React, { useEffect } from "react";
import { GroupDataProvider } from "../../context/groupDataProvider/GroupDataProvider";

const DetailPage = () => {
  
  //EASER EGG
  useEffect(() => {
    console.log(
      "👋 😂 I used to play sports. Then I realized you can buy trophies. Now I'm good at everything. - Demetri Martin 🏆🌟"
    );
  }, []);

  return (
    <GroupDataProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <PrimaryAppBar />
        <PrimaryDraw>
          <GroupMembers />
        </PrimaryDraw>
        <SecondarDraw>
          <EventsList />
        </SecondarDraw>
        <Main>
          <GroupDetails />
        </Main>
      </Box>
    </GroupDataProvider>
  );
};

export default DetailPage;
