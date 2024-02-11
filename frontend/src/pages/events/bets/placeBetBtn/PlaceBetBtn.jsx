import React, { useEffect, useState } from "react";
import { Button, Box, useTheme } from "@mui/material";
import { PlaceBetBtnStyles } from "./placeBetBtnStyles";

export const PlaceBetBtn = ({ bet, toggleBetForm }) => {
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

  let buttonLabel = "Place Bet"; // Default label suggesting new bet placement
  let buttonDisabled = false;

  // Assign buttonClickHandler based on the event and bet status
  let buttonClickHandler = toggleBetForm; // Use passed toggleBetForm function for handling clicks

  if (bet) { // If a bet exists, adjust button behavior based on event timing
    if (eventInProgress || eventHasEnded) {
      buttonLabel = "Betting Closed";
      buttonDisabled = true;
      buttonClickHandler = undefined; // No action when betting is closed
    } else {
      buttonLabel = "Update Bet"; // Allows updating the bet before the event starts
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Button
        variant="outlined"
        disabled={buttonDisabled}
        sx={buttonDisabled ? classes.bettingClosed : classes.placeBet}
        onClick={buttonClickHandler}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
};
