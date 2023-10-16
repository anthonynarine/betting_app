import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    ListItemButton,
    useTheme,
  } from "@mui/material";
  
  import useCrud from "../../../../services/useCrud"
  import { useEffect } from "react";
  import ListItemAvatar from "@mui/material/ListItemAvatar";
  import Avatar from "@mui/material/Avatar";
  // import { MEDIA_URL } from "../../config";
  import { Link } from "react-router-dom";
  import { GroupListStyles } from "./GroupListStyles";
  import React from "react";
  
  const GroupList = ({ open }) => {
    const { apiData, fetchData } = useCrud([], "/groups/");
  
    const theme = useTheme();
    const classes = GroupListStyles(theme);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    useEffect(() => {
      console.log("DATA IN GropList component:", apiData);
    }, [apiData]);
  
    return (
      <>
        <Box sx={classes.mainBox}>
          <Typography
            variant="h6"
            sx={{ display: open ? "block" : "none", color: "#637C5B" }}
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
                <ListItemButton sx={{ minHeight: 0 }}>
                  <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                    <ListItemAvatar sx={{ minWidth: "50px" }}>
                      <Avatar alt="Group Icon" src={group.icon} />
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
  