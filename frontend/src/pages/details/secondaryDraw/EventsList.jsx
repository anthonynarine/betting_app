import { useEffect, useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// import { MEDIA_URL } from "../../config";
import { Link } from "react-router-dom";
import { ListViewStyles } from "../../home/ListViewStyles";
import React from "react";
import { useGroupData } from "../../../context/groupData/GroupDataProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateEventForm from "../../events/crud-forms/CreateEventForm";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import CountDownTimer from "../../events/main/EventCountDownTimer";

const EventsList = () => {
  const theme = useTheme();
  const classes = ListViewStyles(theme);

  const [openCreateEventForm, setCreateEventFormOpen] = useState(false);
  const toggleCreateEventForm = () =>
    setCreateEventFormOpen(!openCreateEventForm);

  const { events } = useGroupData();
  console.log("EventsList  DATA:", events); //  TEST

  useEffect(()=>{},[events])

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // This will align the items at opposite ends
          padding: " 10px", // Adjust the margin as needed
          pt: "7px",
          mr: "1px",
          ml: "2px",
        }}
      >
        <Typography variant="h6" sx={{ color: "#637C5B" }}>
          Events
        </Typography>
        <Box>
          <Tooltip title="Create Event" arrow placement="left" >
            <IconButton>
              <AddCircleOutlineIcon onClick={toggleCreateEventForm} sx={{ color: "#000"}} />
            </IconButton>
          </Tooltip>
          <CreateEventForm
            openCreateEventForm={openCreateEventForm}
            toggleCreateEventForm={toggleCreateEventForm}
          />
        </Box>
      </Box>
      {events &&
        events.map((event) => (
          <ListItem
            key={event.id}
            disablePadding
            sx={{ display: "block" }}
            dense={true}
          >
            <Link
              to={`/event/${event.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 0 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "50px" }}>
                    <Avatar
                      alt="Group Icon"
                      src={"https://source.unsplash.com/random/?star"}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        lineHeight: 1.2,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${event.team1} vs ${event.team2}`}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
    </>
  );
};

export default EventsList;
