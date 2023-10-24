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
import { Link } from "react-router-dom";
import { ListViewStyles } from "../../home/primaryDraw/ListViewStyles"
import React from "react";
import { useMembers } from "../../../context/membersContext/MemberContext"


const GroupMembers = ({ open }) => {
  const theme = useTheme();
  const classes = ListViewStyles(theme);

  const { members } = useMembers();



  return (
    <>
      <Box sx={classes.mainBox}>
        <Typography
          variant="h6"
          sx={{ display: open ? "block" : "none", color: "#637C5B" }}
        >
         {/* {`${name} members`} */}
         Group Members
        </Typography>
      </Box>
      {members &&
        members.map((member) => (
          <ListItem
            key={member.id}
            disablePadding
            sx={{ display: "block" }}
            dense={true}
          >
            <ListItemButton sx={{ minHeight: 0 }}>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                <ListItemAvatar sx={{ minWidth: "50px" }}>
                  <Avatar alt="Group Icon" src={member.user.profile_picture} />
                </ListItemAvatar>
              </ListItemIcon>
              {open && ( // Conditionally render ListItemText based on `open`
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
                      {/* <div></div> {member.admin} */}
                      {member.user.username}
                    </Typography>
                  }
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
    </>
  );
};

export default React.memo(GroupMembers);
