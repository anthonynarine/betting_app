//modal

import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";


const BetDialog = ({ open, onClose, onPlaceBet}) => {
    // State for managing  bet amoount input
    const [betAmout, setBetAmount ] = useState ("");

    //Func to handle placing a bet
    const handlePlaceBet = () => {
        onPlaceBet(betAmout); // Trigger the bet placement action
        onClose(); // close dialog after placeing the bet
    };

    return <>
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Place A Bet</DialogTitle>
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="betAmount"
            type="number"
            fullWidth
            value={betAmout}
            onChange={(e) => setBetAmount(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handlePlaceBet} color="primary">
                Place Bet
            </Button>
        </DialogActions>
    </Dialog>
    
    
    
    </>
};
export default BetDialog;