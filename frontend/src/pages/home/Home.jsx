import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/Drawer/PrimaryDraw";
import Main from "../structure/Main/Main";
import Groups from "./primaryDraw/Groups"
import GroupList from "./primaryDraw/GroupList";

const Home = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw>
        <GroupList />
      </PrimaryDraw>
      <Main>
        <Groups />
      </Main>
    </Box>
  );
};

export default Home;
