import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import HomeTabs from "./HomeTabs";
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