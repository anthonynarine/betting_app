import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CustomAlert from "./placeBetBtn/CustomAlert";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import { useBetData } from "../../../context/bet/BetDataProvider";

const BetForm = ({ open, onClose }) => {
  // Hooks
  const { event } = useEventData();
  const { eventId } = useParams();
  const { createBet, individualBet: currentBetData, updateBet } = useBetData();
  const userId = localStorage.getItem("userId");

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

  // Handlers
  const handleBetSubmission = async () => {
    setIsLoading(true);
    try {
      if (currentBetData) {
        await updateBet(currentBetData.id, betDetails, handleSuccess, handleError);
      } else {
        await createBet(betDetails, handleSuccess, handleError);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setBetDetails({ ...betDetails, [event.target.name]: event.target.value });
  };

  const handleSuccess = (data) => {
    console.log("Bet placed successfully:", data);
    onClose();
  };

  const handleError = (error) => {
    console.error("Error placing bet:", error);

    if (error.response && error.response.data && error.response.data.details) {
      const errorMessage = error.response.data.details;
      setErrorMessage(errorMessage);
    } else if (error.message) {
      console.log("Received errorMessage Axios:", error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (errorMessage && errorMessage.includes("bet amount")) {
      setBetAmountError(errorMessage)
    } else {
      setBetAmountError('')
    }
    console.log("Received error message", errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    if (!open) {
      setErrorMessage(null);
    }
  }, [open]);

  useEffect(() => {
    if (currentBetData) {
      setBetDetails({
        event: currentBetData.event,
        user: currentBetData.user,
        team_choice: currentBetData.team_choice,
        bet_type: currentBetData.bet_type,
        bet_amount: currentBetData.bet_amount,
      });
    }
  }, [currentBetData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="bet-form"
      aria-describedby="form-to-create-a-bet"
      fullWidth
      maxWidth="xs"
    >
      {/* Dialog Title */}
      <DialogTitle id="bet-form">Place A Bet</DialogTitle>
      {/* Dialog Content */}
      <DialogContent id="form-to-create-a-bet">
        {/* Error Alert */}
        {errorMessage && <CustomAlert message={errorMessage} severity="error" />}

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
          fullWidth
          value={betDetails.bet_amount}
          onChange={handleInputChange}
          aria-label="Bet Amount"
          helperText={betAmountError || "Amount to bet"}
        />
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={handleBetSubmission} color="primary" variant="outlined">
          {currentBetData ? "Update Bet" : "Place Bet"}
        </Button>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BetForm;
