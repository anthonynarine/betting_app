import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../../components/primaryDraw/PrimaryDraw";
import SecondaryDraw from "../../components/secondaryDraw/SecondaryDraw";
import Main from "../../components/main/Main";
// import EventDetails from "../events/main/EventDetials";
import { EventDataProvider } from "../../context/eventData/EventDataProvider";
import { GroupDataProvider } from "../../context/groupData/GroupDataProvider";
import EventDetails from "./main/EventDetials";

const EventsPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <EventDataProvider>
        <CssBaseline />
        <PrimaryAppBar />
        <PrimaryDraw></PrimaryDraw>
        <SecondaryDraw></SecondaryDraw>
        <Main> <EventDetails/> </Main>
      </EventDataProvider>
    </Box>
  );
};

export default EventsPage;
