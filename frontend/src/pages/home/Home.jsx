import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/PrimaryDraw";
import Main from "../structure/Main/Main";
import Groups from "../structure/Main/Groups/Groups";
import GroupList from "../structure/PrimaryDraw/HomePageContent/GroupList";

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
