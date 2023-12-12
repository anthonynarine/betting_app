// StripeForm.jsx  THIS COMPONENT IS NO LONGER IN USE 
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";

const StripeForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe has not loaded");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    onSubmit(cardElement, amount); // Call the passed onSubmit function
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Amount in USD"
        variant="outlined"
        fullWidth
        type="number"
        id="amount"
        name="amount"
        autoFocus
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Box sx={{ margin: 2 }}>
        <CardElement />
      </Box>
      <Button variant="contained" color="primary" fullWidth type="submit">
        Add Funds
      </Button>
    </Box>
  );
};

export default StripeForm;
