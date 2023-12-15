//modal

import React, { useState } from "react";
import BetRequest from "./BetRequest";
import { useEventData } from "../../../../context/eventData/EventDataProvider";
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

const BetForm = ({ open, onClose }) => {
  const { event } = useEventData();

  const { eventId } = useParams()
  const userId = localStorage.getItem("userId")
  console.log(eventId)

  // State for managing  bet amoount input
  const [betDetials, setBetDetails] = useState({
    event: eventId,
    user: userId,
    team_choice: "",
    bet_type: "",
    amount: "",
  });

  const handleInputChange = (event) => {
    setBetDetails({ ...betDetials, [event.target.name]: event.target.value });
  };

  const handleSuccess = (data) => {
    console.log("Bet placed successfulluy:", data);
    onClose();
  };

  const handleError = (error) => {
    console.error("Error placing bet:", error);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Place A Bet</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Team Choice</InputLabel>
            <Select
              value={betDetials.team_choice}
              onChange={handleInputChange}
              name="team_choice"
            >
              <MenuItem value="Team 1">{event.team1}</MenuItem>
              <MenuItem value="Team 2">{event.team2}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Bet Type</InputLabel>
            <Select
              value={betDetials.bet_type}
              onChange={handleInputChange}
              name="bet_type"
            >
              <MenuItem value="Win">Win</MenuItem>
              <MenuItem value="Loss">Loss</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            value={betDetials.amount}
            fullWidth
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <BetRequest
            betDetails={betDetials}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
export default BetForm;
