import { Typography, Box, Container, Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

function Groups( { groups }) {


  // Sample static data for groups
  const staticData = [
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
    { id: 3, name: "Group 3" },
  ];

  const renderGroupList = () => {
    return (
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}
        style={{ width: "100%" }}
      >
        {groups.map((group) => (
          <Grid
            item
            key={group.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            style={{ width: "100%" }}
          >
            {group.name}
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <Container maxWidth="xxl" sx={{ px: { md: 5, lg: 7 }, width: "100%" }}>
        <Box sx={{ pt: 4 }}>
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
            Groups
          </Typography>
        </Box>
        <Box>{renderGroupList()}</Box>
      </Container>
    </>
  );
}

export default Groups;
