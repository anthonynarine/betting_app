import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/Drawer/PrimaryDraw";
import SecondaryDraw from "../structure/SecondaryDraw/SecondaryDraw";
import Main from "../structure/Main/Main";
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
