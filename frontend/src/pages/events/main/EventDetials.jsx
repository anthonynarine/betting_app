import { Typography, Box, Container, } from "@mui/material";
import { useEventData } from "../../../context/eventData/EventDataProvider"
import { useGroupData } from "../../../context/groupData/GroupDataProvider";

import EventDetailsCard from "./EventDetailCard";

function EventDetails() {

const { event, group, eventId } = useEventData();

// console.log("EventDetail Component event DATA TEST", event)
// console.log("EventDetail Component group DATA TEST", group)
// console.log("EventDetail Component eventId DATA TEST", event.id)

    
  const renderHeader = () => {
    if (eventId) {
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
          Event unavailable
        </Typography>
      );
    }
  };


  const renderSubheader = () => {
    if (eventId) {
      return (
        <Box display="flex" justifyContent="center" alignItems="flex-start" >
          <EventDetailsCard  />
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
          Event unavailabe 
        </Typography>
      );
    }
  };

  return (
    <>
      <Container maxWidth="xxl" sx={{ px: {sm: 3, md: 5, lg: 7 }, width: "100%" }}>
        <Box sx={{ pt: 4 }}>{renderHeader()}</Box>
        <Box>{renderSubheader()}</Box>
        {/* <Box>{renderGroupList()}</Box> */}


      </Container>
    </>
  );
}

export default EventDetails;
