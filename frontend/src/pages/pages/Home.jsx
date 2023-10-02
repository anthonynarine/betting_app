import { useEffect, useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../structure/PrimaryAppBar/PrimaryAppBar";
import PrimaryDraw from "../structure/PrimaryDraw/PrimaryDraw";
import Main from "../structure/Main/Main";
import Groups from "../structure/Main/Groups/Groups";
import useCrud from "../../services/useCrud";
import axios from "axios";

import { BASE_URL } from "../../config";

const Home = () => {
  // const [groups, setGroups] = useState(null);
  // const url = "/groups/";

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}${url}`);
  //       console.log(response.data);
  //       setGroups(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);


  const url = "/groups/";
  const { apiData, error, isLoading, fetchData } = useCrud(url);

  useEffect(() => {
    fetchData()
      .then((data) => {
        console.log("FETCHED from Home Page", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [url]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!apiData || apiData.length === 0) {
    return <p>No data available.</p>;
  }


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw></PrimaryDraw>
      <Main>
        {/* <Groups groups={groups} /> */}
        <Groups groups={apiData} />
      </Main>
    </Box>
  );
};

export default Home;
