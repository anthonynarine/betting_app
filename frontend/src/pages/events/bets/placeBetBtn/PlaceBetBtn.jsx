import React, { useEffect, useState } from "react";
import { Button, Tooltip, Box, useTheme } from "@mui/material";
import { useEventData } from "../../../../context/eventData/EventDataProvider";
import { PlaceBetBtnStyles } from "./placeBetBtnStyles";
import { useBetData } from "../../../../context/bet/BetDataProvider";

  // State: currentTime
  // Purpose: Tracks the current time in the component.
  // Details:
  // - Initialized with the current timestamp using Date.now().
  // - Used to determine if the current time has surpassed the event start time.
  // - Updated every second to reflect the real-world time progression.

export const PlaceBetBtn = ({ toggleBetForm }) => {
  const { event } = useEventData();
  const { individualBet } = useBetData();
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(()=>{
  // useEffect Hook: Interval setup for currentTime
  // Purpose: Sets up a mechanism to update the currentTime state every second.
  // Details:
  // - The useEffect hook runs after the component mounts and sets up an interval.
  // - setInterval is used to call setCurrentTime(Date.now()) every 1000 milliseconds.
  // - This periodic update triggers a re-render of the component, allowing it to 
  //   react to the real-time progression and update the UI accordingly.
  // - A cleanup function is returned that clears the interval when the component unmounts.
  //   This is important for preventing memory leaks and unnecessary computations.
    const interval = setInterval(()=>{
      setCurrentTime(Date.now()); // Update the currentTime state ever second
    }, 1000) // 1 second
    return ()=> clearInterval(interval)  // Clean up on component unmount
  }, [])

  // Convert event time to a Date object and get its timestamp
  let eventStartTime = new Date(event.start_time).getTime();

  // Check if the event has started
  let eventHasStarted = currentTime >= eventStartTime;

  // Check if there is an active bet and it has not started
  let hasActiveBet = individualBet && !individualBet.has_started;

  let theme = useTheme();
  let classes = PlaceBetBtnStyles(theme);

  // Define the label and click handler based on conditions
  let buttonLabel = "";
  let buttonClickHandler = null;

  if (eventHasStarted) {
    buttonLabel = "Betting Closed";
  } else if (!eventHasStarted && !hasActiveBet) {
    buttonLabel = "Place Bet";
    buttonClickHandler = toggleBetForm;
  } else if (!eventHasStarted && hasActiveBet) {
    buttonLabel = "Update Bet";
    buttonClickHandler = toggleBetForm;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {buttonClickHandler ? (
        <Button variant="outlined" sx={classes.placeBet} onClick={buttonClickHandler}>
          {buttonLabel}
        </Button>
      ) : (
        <Tooltip title="Betting Closed arrow">
          <Button variant="outlined" disabled sx={classes.bettingClosed}>
            {buttonLabel}
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};
