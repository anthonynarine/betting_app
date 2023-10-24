import { Box, CssBaseline, useTheme } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/Drawer/PrimaryDraw";
import Main from "../structure/Main/Main";

import GroupMembers from "./primayrDraw/GroupMembers";
import EventsList from "./secondaryDraw/EventsList";
import SecondarDraw from "../structure/SecondaryDraw/SecondaryDraw";
import Groups from "./main/Groups";

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useCrud from "../../services/useCrud";
import MembersProvider from "../../context/membersContext/MemberProvider";

const DetailPage = () => {
  const { groupId } = useParams();
  const { apiData, fetchData } = useCrud([], `/groups/${groupId}/`);
  const { members } = apiData;

  const accessToken = localStorage.getItem('accessToken');


  useEffect(() => {
    fetchData(accessToken);
  }, []);

  useEffect(() => {
    console.log("Initial members:", members);
  }, [members]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <MembersProvider groupMembers={members} >
        <PrimaryDraw>
          <GroupMembers />
        </PrimaryDraw>
        <SecondarDraw>
          <EventsList apiData={apiData} />
        </SecondarDraw>
        <Main>
          <Groups />
        </Main>
      </MembersProvider>
    </Box>
  );
};

export default DetailPage;
