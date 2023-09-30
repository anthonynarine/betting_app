import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
// import PrimaryDraw from "../components/PrimaryDraw/PrimaryDraw";
// import Main from "../components/Main/Main";

const Home = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      {/* <PrimaryDraw></PrimaryDraw>
      <Main></Main> */}
    </Box>
  );
};

export default Home;
