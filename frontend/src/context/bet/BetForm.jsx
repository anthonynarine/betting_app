import React, { useEffect, useState } from "react";
import BetRequest from "../../pages/events/bets/BetRequest";
import { useEventData } from "../eventData/EventDataProvider";
import { useParams } from "react-router-dom";
import CustomAlert from "../../pages/events/bets/placeBetBtn/CustomAlert";
import { useBetData } from "./BetDataProvider";
import {
  Button,
  Di
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
} from "@mui/material";

/**
 * BetForm Component
 *
 * This component renders a modal dialog form for placing a bet.
 * It allows the user to select a team, bet type, and enter an amount for the bet.
 *
 * Props:
 * - open: Boolean indicating if the modal should be open.
 * - onClose: Function to call when the modal is requested to be closed.
 */
const BetForm = ({ open, onClose, }) => {
  const { event } = useEventData();
  const { eventId } = useParams();
  const { createBet, individualBet : currentBetData, updateBet } = useBetData();
  const userId = localStorage.getItem("userId");

  // State for managing bet details input
  const [betDetails, setBetDetails] = useState({
    event_id: eventId,
    user: userId,
    team_choice: "",
    bet_type: "",
    bet_amount: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [betAmountError, setBetAmountError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBetSubmission = async () => {
    setIsLoading(true);
    try {
      if (currentBetData) {
        await updateBet(currentBetData.id, betDetails, handleSuccess, handleError);
      } else{
        //if not in update mode assume it's create mode
        // call create func
        await createBet(betDetails, handleSuccess, handleError)
      }
    } catch (error) {
      console.error("Error placing bet:", error)
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles input changes and updates the betDetails state.
   *
   * @param {Object} event - The event object from the input change.
   */
  const handleInputChange = (event) => {
    setBetDetails({ ...betDetails, [event.target.name]: event.target.value });
  };

  /**
   * Callback for successful bet placement.
   *
   * @param {Object} data - The response data after successful bet placement.
   */
  const handleSuccess = (data) => {
    console.log("Bet placed successfully:", data);
    onClose();
  };

  /**
   * Callback for errors during bet placement.
   *
   * @param {Object} error - The error object if bet placement fails.
   */
  const handleError = (error) => {
    console.error("Error placing bet:", error);

    if (error.response && error.response.data && error.response.data.details) {
      // Extract error message from the error object
      const errorMessage = error.response.data.details;
      console.log("Received errorMessage Django:", errorMessage);
      setErrorMessage(errorMessage); // Update the error message using setErrorMessage
    } else if (error.message) {
      // If no detailed error message is available, use the error message from Axios
      console.log("Received errorMessage Axios:", error.message);
      setErrorMessage(error.message); // Update the error message using setErrorMessage
    }
  };

  useEffect(() => {
    // Check if the error message is related to the bet amount and update the state
    if (errorMessage && errorMessage.includes("bet amount")) {
      setBetAmountError(errorMessage)
    } else {
      setBetAmountError('')
    }
    console.log("Recieved error message", errorMessage);
  }, [errorMessage]);

  // Reset error message when the modal is closed
  useEffect(() => {
    if (!open) {
      setErrorMessage(null);
    }
  }, [open]);

  useEffect(() => {
    // Check if the form is in update mode and currentBetData is available
    // currentBetData: An object containing the details of the bet to be updated
    if (currentBetData) {
      // If currentBetData is present, pre-populate the form fields
      // with the existing bet details. This allows the user to see and modify the 
      // current details of the bet.
      setBetDetails({
        // Use currentBetData to pre-fill the form
        event: currentBetData.event,
        user: currentBetData.user,
        team_choice: currentBetData.team_choice,
        bet_type: currentBetData.bet_type,
        bet_amount: currentBetData.bet_amount,
      });
    }
  }, [currentBetData]);
  


  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="bet-form"
        aria-describedby="form-to-create-a-bet"
        sx={{
          '& .MuiDialog-paper': { // Targeting the inner paper component
            width: '400px', // Fixed width
            maxWidth: '400px', // Maximum width
          }
        }}
      >
        <DialogTitle id="bet-form">Place A Bet</DialogTitle>
        {/* ... error message display ... */}
        <DialogContent id="form-to-create-a-bet">
          {/* Error Alert */}
          {errorMessage && (
            // <Alert severity="error" sx={{ mb:2}}>
            //   {errorMessage}
            // </Alert>
            <CustomAlert message={errorMessage} severity="error" />
          )}
          {/* Team Choice Dropdown */}
          {/* <Tooltip title="Select the team you want to bet on" placement="right"> */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="team-choice-label">Team Choice</InputLabel>
              <Select
                labelId="team-choice-label"
                value={betDetails.team_choice}
                onChange={handleInputChange}
                name="team_choice"
                label="Team Choice"
              >
                <MenuItem value="Team 1">{event.team1}</MenuItem>
                <MenuItem value="Team 2">{event.team2}</MenuItem>
              </Select>
            </FormControl>
          {/* </Tooltip> */}

          {/* Bet Type Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="bet-type-label">Bet Type</InputLabel>
            <Select
              labelId="bet-type-label"
              value={betDetails.bet_type}
              onChange={handleInputChange}
              name="bet_type"
              label="Bet Type"
            >
              <MenuItem value="Win">Win</MenuItem>
              <MenuItem value="Lose">Lose</MenuItem>
            </Select>
          </FormControl>

          {/* Bet Amount Input */}
          <TextField
            autoFocus
            margin="dense"
            id="bet_amount"
            name="bet_amount"
            label="Amount"
            type="number"
            value={betDetails.bet_amount}
            fullWidth
            onChange={handleInputChange}
            aria-label="Bet Amount"
            // error={!!betAmountError}
            helperText={betAmountError ||"Amount to bet"}
          />
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "cen", paddingBottom:3}}>
          <DialogActions>
            <Button
              onClick={handleBetSubmission}
              color="primary"
              variant="outlined"
              >
                {currentBetData ? "Update Bet" : "Place Bet"}
              </Button>
            <Button onClick={onClose} color="primary" variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </Box>
        {/* ... DialogActions and Buttons ... */}
      </Dialog>
    </>
  );
};

export default BetForm;