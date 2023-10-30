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
import { ListViewStyles } from "../../home/primaryDraw/ListViewStyles";
import React, { useEffect } from "react";
// import { useMembers } from "../../../context/membersContext/MemberContext"
import { useApiData } from "../../../context/apiDataProvider/ApiDataProvider";

const GroupMembers = ({ open }) => {
  const theme = useTheme();
  const classes = ListViewStyles(theme);

  const { members } = useApiData();
  console.log("GroupMembers Full member object:", members)

  useEffect(()=>{},[members])


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
        members.map((member, index) => {
          console.log(`Current member object at index ${index}:`, member);
          if (!member.user) {
            console.error("member.user is undefined for member:", member);
            return null; // Skip this iteration
          }
          return (
            <ListItem
              key={member.user.id}
              disablePadding
              sx={{ display: "block" }}
              dense={true}
            >
              <ListItemButton sx={{ minHeight: 0 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "50px" }}>
                    <Avatar
                      alt="Group Icon"
                      src={member.user.profile_picture || "path/to/default/image.jpg"}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                {open && (
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
                        {member.user.username}
                      </Typography>
                    }
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
    </>
  );
};

export default GroupMembers;
