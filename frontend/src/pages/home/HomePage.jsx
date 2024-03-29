import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/header/PrimaryAppBar";
import HomeTabs from "./HomeTabs";
import Footer from "./Footer";

// Data from context
import { BetDataProvider } from "../../context/bet/BetDataProvider";
import { EventDataProvider } from "../../context/eventData/EventDataProvider";


const HomePage = () => {

  return (
    <EventDataProvider>
      <BetDataProvider>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <CssBaseline />
          <PrimaryAppBar />
          <HomeTabs />
          <Footer />
        </Box>
      </BetDataProvider>
    </EventDataProvider>
  );
};

export default HomePage;