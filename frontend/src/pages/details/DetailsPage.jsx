import { Box, CssBaseline, useTheme } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/PrimaryDraw";
import Main from "../structure/Main/Main";
import Groups from "../structure/Main/Groups/Groups";
import GroupMembers from "../structure/PrimaryDraw/DetailsPageContent/GroupMembers";
import EventsList from "../structure/SecondaryDraw/Events/EventList";
import SecondarDraw from "../structure/SecondaryDraw/SecondaryDraw";

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useCrud from "../../services/useCrud";

const DetailPage = () => {
  const { groupId } = useParams();
  const { apiData, fetchData } = useCrud([], `/groups/${groupId}/`);

  // const { name, location, banner_img, description, events, members } = apiData;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("DATA In DetailsPage to be Passed:", apiData);
  }, [apiData]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw>
        <GroupMembers apiData={apiData} />
      </PrimaryDraw>
      <SecondarDraw>
        <EventsList  apiData={apiData} />
      </SecondarDraw>
      <Main>
        <Groups />
      </Main>
    </Box>
  );
};

export default DetailPage;
