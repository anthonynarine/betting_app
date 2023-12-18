import { Button, Tooltip, Box, useTheme } from "@mui/material";
import { useEventData } from "../../../../context/eventData/EventDataProvider";
import { PlaceBetBtnStyles } from "./placeBetBtnStyles";

export const PlaceBetBtn = ({ toggleBetForm }) => {
  const { event } = useEventData();

  //convert event time to a Date object and get its timestamp
  let eventStartTime = new Date(event.time).getTime();
  let currentTime = Date.now();

  //check if the current time is past the event start time
  let isEventStart = currentTime >= eventStartTime;

  let theme = useTheme();
  let classes = PlaceBetBtnStyles(theme);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isEventStart ? (
          <Tooltip title="Betting Closed arrow">
            <Button
              variant="outlined"
              disabled
              sx={classes.bettingClosed}
            >
              Betting Closed
            </Button>
          </Tooltip>
        ) : (
          <Button
            variant="outlined"
            sx={classes.placeBet}
            onClick={toggleBetForm}
          >
            Place Bet
          </Button>
        )}
      </Box>
    </>
  );
};
