import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../../components/primaryDraw/PrimaryDraw"
import Main from "../../components/main/Main";
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
