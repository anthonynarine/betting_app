import React, { useEffect, useState } from "react";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { PlaceBetBtnStyles } from "./placeBetBtnStyles";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon

export const PlaceBetBtn = ({ bet, toggleBetForm, onDeleteBet }) => { 
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); // Continuously update currentTime every second
    return () => clearInterval(interval);
  }, []);

  // Parse event start and end times
  const eventStartTime = new Date(bet?.event?.start_time).getTime();
  const eventEndTime = new Date(bet?.event?.end_time).getTime();

  // Determine the event and bet status
  const eventInProgress = currentTime >= eventStartTime && currentTime <= eventEndTime;
  const eventHasEnded = currentTime > eventEndTime;

  let theme = useTheme();
  let classes = PlaceBetBtnStyles(theme);

  let buttonElement; // This will hold the JSX for our buttons

  // Determine if the bet can be edited
  const canEditBet = bet && !eventInProgress && !eventHasEnded;

  if (canEditBet) {
    // Bet can be edited, display the EditIcon and DeleteIcon with tooltips for editing and deleting
    buttonElement = (
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1} }}>
        <Tooltip
          title="Edit Bet"
          placement="top"
          PopperProps={classes.tooltipConfig.PopperProps}
          PaperProps={classes.tooltipConfig.PaperProps}
        >
          <IconButton onClick={toggleBetForm} sx={classes.placeBet}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Delete Bet"
          placement="top"
          PopperProps={classes.tooltipConfig.PopperProps}
          PaperProps={classes.tooltipConfig.PaperProps}
        >
          <IconButton onClick={onDeleteBet} sx={classes.placeBet}> {/* Assuming onDeleteBet handles bet deletion */}
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  } else {
    // Bet cannot be edited or there is no bet; do not display icons
    buttonElement = (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Display alternative content or nothing if no editable bet */}
      </Box>
    );
  }

  return buttonElement;
};
