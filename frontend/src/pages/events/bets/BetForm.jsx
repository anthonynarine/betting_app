import React, { useEffect, useState } from "react";
import BetRequest from "./BetRequestBtn";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import { useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
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
const BetForm = ({ open, onClose }) => {
  // Retrieve event data from context
  const { event } = useEventData();

  // Get the event ID from the URL parameters
  const { eventId } = useParams();

  // Retrieve the user ID from local storage
  const userId = localStorage.getItem("userId");

  // State for managing bet details input
  const [betDetails, setBetDetails] = useState({
    event: eventId,
    user: userId,
    team_choice: "",
    bet_type: "",
    bet_amount: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log("Recieved error message", errorMessage);
  }, [errorMessage]);

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

  // Reset error message when the modal is closed
  useEffect(() => {
    if (!open) {
      setErrorMessage(null);
    }
  }, [open]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="bet-form"
        aria-describedby="form-to-create-a-bet"
      >
        <DialogTitle id="bet-form">Place A Bet</DialogTitle>
        {/* ... error message display ... */}
        <DialogContent id="form-to-create-a-bet">
          {/* Team Choice Dropdown */}
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
          />
        </DialogContent>
        {/* ... DialogActions and Buttons ... */}
      </Dialog>
    </>
  );
};

export default BetForm;