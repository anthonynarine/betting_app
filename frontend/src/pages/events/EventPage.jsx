import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/Drawer/PrimaryDraw";
import SecondaryDraw from "../structure/SecondaryDraw/SecondaryDraw";
import Main from "../structure/Main/Main";
// import EventDetails from "../events/main/EventDetials";

import { ApiDataProvider } from "../../context/apiDataProvider/ApiDataProvider";

const EventsPage = () => {
  return (
    <ApiDataProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <PrimaryAppBar />
        <PrimaryDraw></PrimaryDraw>
        <SecondaryDraw></SecondaryDraw>
        <Main>
          {/* <EventDetails /> */}
        </Main>
      </Box>
    </ApiDataProvider>
  );
};

export default EventsPage;
