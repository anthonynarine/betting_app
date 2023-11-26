import { Button, Tooltip, Box } from "@mui/material";
import { useEventData } from "../../../context/eventData/EventDataProvider";

export const PlaceBetBtn = ({ toggleBetForm }) => {
  const { event } = useEventData();

  //convert event time to a Date object and get its timestamp
  const eventStartTime = new Date(event.time).getTime();
  const currentTime = Date.now();

  //check if the current time is past the event start time
  const isEventStart = currentTime >= eventStartTime;

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isEventStart ? (
          <Tooltip title="Betting Closed arrow">
            <Button
              variant="outlined"
              disabled
              sx={{
                borderColor: "#000",
                backgroundColor: "#000",
                color: "white",
                borderRadius: "15px",
                fontWeight: "500",
                // textShadow: "1px 1px 2px #aaa",
                padding: "3px 12px", // Smaller padding
                fontSize: "0.875rem", // Smaller font size
                textTransform: "none",
                "&.Mui-disabled": {
                  color: "red", // Override for disabled state
                  borderColor: "#000",
                },
              }}
            >
              Betting Closed
            </Button>
          </Tooltip>
        ) : (
          <Button
            variant="outlined"
            sx={{
              borderColor: "#000",
              backgroundColor: "#000",
              color: "#00DE49",
              borderRadius: "15px",
              fontWeight: "500",
              // textShadow: "1px 1px 2px #aaa",
              padding: "3px 12px", // Smaller padding
              fontSize: "0.875rem", // Smaller font size
              textTransform: "none",
              "&:hover": {
                borderColor: "#00DE49",
                backgroundColor: "#00DE49",
                color: "black",
              },
            }}
            onClick={toggleBetForm}
          >
            Place Bet
          </Button>
        )}
      </Box>
    </>
  );
};
