import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../../components/primaryDraw/PrimaryDraw";
import Main from "../../components/main/Main";
import GroupListCard from "./main/GroupListCard";
import GroupList from "./primaryDraw/GroupList";
import HomeTabs from "./tabs/HomeTabs";
import Footer from "./Footer";

const HomeV2 = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <HomeTabs />
      <Footer />
    </Box>
  );
};

export default HomeV2;
