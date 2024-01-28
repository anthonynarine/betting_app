import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
  useTheme,
} from "@mui/material";

import useCrud from "../../../services/useCrud"
import { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// import { MEDIA_URL } from "../../config";
import { Link } from "react-router-dom";
import { ListViewStyles } from "./ListViewStyles";
import React from "react";


const GroupList = ({ open }) => {
  const { apiData, fetchData } = useCrud();

  const theme = useTheme();
  const classes = ListViewStyles(theme);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    fetchData("/groups/", accessToken);
  }, []);

  //DATA TEST
  // useEffect(() => {
  //   console.log("DATA IN GropList component:", apiData);
  // }, [apiData]);

  return (
    <>
      <Box sx={classes.mainBox}>
        <Typography
          variant="h6"
          sx={{ display: open ? "block" : "none", color: "white" }}
        >
          Group List
        </Typography>
      </Box>
      {apiData &&
        apiData.map((group) => (
          <ListItem
            key={group.id}
            disablePadding
            sx={{ display: "block" }}
            dense={true}
          >
            <Link
              to={`/group/${group.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 0, color: "white" }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "white" }}>
                  <ListItemAvatar sx={{ minWidth: "50px" }}>
                    <Avatar alt="Group Icon" src={group.icon} sx={{ backgroundColor: "white" }} />
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
                      {group.name}
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

export default React.memo(GroupList);

