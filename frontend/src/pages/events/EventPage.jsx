import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../../components/primaryDraw/PrimaryDraw"
import SecondaryDraw from "../../components/secondaryDraw/SecondaryDraw";
import Main from "../../components/main/Main";
// import EventDetails from "../events/main/EventDetials";

const EventsPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw></PrimaryDraw>
      <SecondaryDraw></SecondaryDraw>
      <Main>{/* <EventDetails /> */}</Main>
    </Box>
  );
};

export default EventsPage;
