import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
  useTheme,
} from "@mui/material";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// import { MEDIA_URL } from "../../config";
import { Link } from "react-router-dom";
import { ListViewStyles } from "../../home/primaryDraw/ListViewStyles";
import React from "react";
import { useGroupData } from "../../../context/groupDataProvider/GroupDataProvider";

const EventsList = () => {
  const theme = useTheme();
  const classes = ListViewStyles(theme);

  const { events } = useGroupData();
  console.log("Events Page DATA:", events); //  TEST

  return (
    <>
      <Box sx={classes.mainBox}>
        <Typography variant="h6" sx={{ color: "#637C5B" }}>
          Group Events
        </Typography>
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
                    src={"https://source.unsplash.com/random/?group"}
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

export default React.memo(EventsList);
