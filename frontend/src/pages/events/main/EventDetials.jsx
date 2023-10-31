import { Typography, Box, Container, Grid } from "@mui/material";
import React, { useEffect, } from "react";
import useCrud from "../../../services/useCrud";
import { useParams } from "react-router-dom";
import GroupCard from "../../home/main/GroupCard";
import GroupDetailsCard from "../../details/main/GroupDetailsCard";
import { useApiData } from "../../../context/apiDataProvider/ApiDataProvider";

function EventDetails() {


const { events,  userId, groupId } = useApiData();

console.log("EventDetail Component DATA TEST", events)
console.log("EventDetail Component DATA TEST", groupId)

    
  const renderHeader = () => {
    if (groupId) {
      return null;
    } else {
      return (
        <Typography
          variant="h3"
          noWrap
          component="h1"
          sx={{
            display: {
              sm: "block",
              fontWeight: 700,
              fontSize: "48px",
              letterSpacing: "-2px",
            },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Event Details
        </Typography>
      );
    }
  };


  const renderSubheader = () => {
    if (groupId) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center">
          <GroupDetailsCard apiData={apiData} groupId={groupId} />
        </Box>
      );
    } else {
      return (
        <Typography
          variant="h6"
          noWrap
          component="h2"
          color="textSecondary"
          sx={{
            display: {
              sm: "block",
              fontWeight: 700,
              fontSize: "48px",
              letterSpacing: "-.5px",
            },
            textAlign: { xs: "center", sm: "left" },
            paddingBottom: 1,
          }}
        >
          Groups
        </Typography>
      );
    }
  };

  return (
    <>
      <Container maxWidth="xxl" sx={{ px: {sm: 3, md: 5, lg: 7 }, width: "100%" }}>
        <Box sx={{ pt: 4 }}>{renderHeader()}</Box>
        <Box>{renderSubheader()}</Box>
        <Box>{renderGroupList()}</Box>
      </Container>
    </>
  );
}

export default EventDetails;
