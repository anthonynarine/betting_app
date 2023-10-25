import { Box, CssBaseline, useTheme } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/Drawer/PrimaryDraw";
import Main from "../structure/Main/Main";

import GroupMembers from "./primayrDraw/GroupMembers";
import EventsList from "./secondaryDraw/EventsList";
import SecondarDraw from "../structure/SecondaryDraw/SecondaryDraw";
import Groups from "./main/Groups";

import React, { useEffect } from "react";
import MembersProvider from "../../context/membersContext/MemberProvider";
import { ApiDataProvider, useApiData } from "../../context/apiDataProvider/ApiDataProvider";

const DetailPage = () => {


  const { apiData } = useApiData();

  useEffect(() => {
    console.log("Details Page DATA TEST:", apiData);
  }, [apiData]); // Refetches data on apiData changes

  return (
    <ApiDataProvider>
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
          <Groups />
        </Main>
      </Box>
    </ApiDataProvider>
  );
};

export default DetailPage;
