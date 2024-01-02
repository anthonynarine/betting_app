import React from "react";
import { Button, Tooltip, Box, useTheme } from "@mui/material";
import { useEventData } from "../../../../context/eventData/EventDataProvider";
import { PlaceBetBtnStyles } from "./placeBetBtnStyles";
import { useBetData } from "../../../../context/bet/BetDataProvider";

export const PlaceBetBtn = ({ toggleBetForm }) => {
  const { event } = useEventData();
  const { individualBet } = useBetData();

  // Convert event time to a Date object and get its timestamp
  let eventStartTime = new Date(event.start_time).getTime();
  let currentTime = Date.now();

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
