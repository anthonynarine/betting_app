import { Button, Tooltip, Box } from "@mui/material";


export const PlaceBetBtn = ({setBetFormOpen}) => {

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* <Tooltip title="Join Group" arrow> */}
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
          onClick={() => setBetFormOpen(true)}
        >
          Place Bet
        </Button>
        {/* </Tooltip> */}
      </Box>
    </>
  );
};
