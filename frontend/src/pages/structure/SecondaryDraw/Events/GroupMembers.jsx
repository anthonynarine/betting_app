import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
  useTheme,
} from "@mui/material";

import useCrud from "../../../../services/useCrud";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// import { MEDIA_URL } from "../../config";
import { Link } from "react-router-dom";
import { ListViewStyles } from "../../PrimaryDraw/ListViewStyles";
import React from "react";


const EventsList = ({ events }) => {
  const theme = useTheme();
  const classes = ListViewStyles(theme);


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
          </ListItem>
        ))}
    </>
  );
};

export default React.memo(EventsList);
