import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../../components/primaryDraw/PrimaryDraw";
import SecondaryDraw from "../../components/secondaryDraw/SecondaryDraw";
import Main from "../../components/main/Main";
// import EventDetails from "../events/main/EventDetials";
import { EventDataProvider } from "../../context/eventData/EventDataProvider";
import { GroupDataProvider } from "../../context/groupData/GroupDataProvider";
import { BetDataProvider } from "../../context/bet/BetDataProvider";
import EventDetails from "./main/EventDetials";
import BetList from "./bets/BetList";

const EventsPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <GroupDataProvider>
        <EventDataProvider>
          <BetDataProvider>
            <CssBaseline />
            <PrimaryAppBar />
            <PrimaryDraw>
              <BetList />
            </PrimaryDraw>
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
