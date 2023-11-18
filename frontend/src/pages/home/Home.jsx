import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../../components/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../../components/primaryDraw/PrimaryDraw";
import Main from "../../components/main/Main";
import GroupListCard from "./main/GroupListCard";
import GroupList from "./primaryDraw/GroupList";
import UserServices from "../../context/user/UserContext";



const Home = () => {



  return (
    <UserServices>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <PrimaryAppBar />
        <PrimaryDraw>
          <GroupList />
        </PrimaryDraw>
        <Main>
          <GroupListCard />
        </Main>
      </Box>
    </UserServices>
  );
};

export default Home;
