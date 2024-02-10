import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import Main from "../../components/main/Main";
// import EventDetails from "../events/main/EventDetials";
import { EventDataProvider } from "../../context/eventData/EventDataProvider";
import { GroupDataProvider } from "../../context/groupData/GroupDataProvider";
import { BetDataProvider } from "../../context/bet/BetDataProvider";
import EventDetails from "./main/EventDetials";

const EventsPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <GroupDataProvider>
        <EventDataProvider>
          <BetDataProvider>
            <CssBaseline />
            <PrimaryAppBar />
            {/* <SecondaryDraw></SecondaryDraw> */}
            <Main>
              <EventDetails />
            </Main>
          </BetDataProvider>
        </EventDataProvider>
      </GroupDataProvider>
    </Box>
  );
};

export default EventsPage;
