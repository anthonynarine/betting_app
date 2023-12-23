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
  import { useBetData } from "../../../context/bet/BetDataProvider";


  
  const BetList = ({ open }) => {
    const theme = useTheme();
    const classes = ListViewStyles(theme);
  
    const { bets } = useBetData();
    console.log("All Bets Received form context:", bets)  //DEBUG TEST
  
    useEffect(()=>{},[bets])
  
  
    return (
      <>
        <Box sx={classes.mainBox}>
          <Typography
            variant="h6"
            sx={{ display: open ? "block" : "none", color: "#637C5B" }}
          >
            {/* {`${name} members`} */}
            All Current Bets
          </Typography>
        </Box>
        {bets &&
          bets.map((bet, index) => {
            // console.log(`Current member object at index ${index}:`, member);
            if (!bet) {
              // console.error("member.user is undefined for member:", member);
              return null; // Skip this iteration
            }
            return (
              <ListItem
                key={bet.id}
                disablePadding
                sx={{ display: "block" }}
                dense={true}
              >
                <ListItemButton sx={{ minHeight: 0 }}>
                  <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
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
                          {bet.team_choice} to {bet.bet_type}  ${bet.amount}
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
  
  export default BetList;
  