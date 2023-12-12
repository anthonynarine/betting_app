// StripeChargeComponent.jsx
import React, { useState } from "react";
import {
  useTheme,
  Container,
  useMediaQuery,
  Typography,
  Box,
  TextField,
  Button
} from "@mui/material";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { useUserServices } from "../context/user/UserContext";
import useAxiosWithInterceptorJwt from "../services/jwtinterceptor-jwtReq";
import { StripeStyles } from "./StripeStyles";

function StripeChargeComponent() {
  console.log("StripeChargeComponent mounted");
  const theme = useTheme();
  const classes = StripeStyles(theme);
  const isLargeScreen = useMediaQuery("(min-width:800px)");

  const stripe = useStripe();
  const elements = useElements();
  const { fetchUserData } = useUserServices();
  const jwtReqAxios = useAxiosWithInterceptorJwt();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe has not loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Use jwtReqAxios for making the post request
      const response = await jwtReqAxios.post("/stripe/charge/", {
        amount: parseInt(amount) * 100, // Convert dollars to cents
        source: paymentMethod.id,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        fetchUserData(); // Update user data
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred while processing the payment.");
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth={isLargeScreen ? "xs" : "sm"} sx={classes.container}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Add Funds
      </Typography>
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
          test
          <CardElement />
        </Box>
        <Button variant="contained" color="primary" fullWidth type="submit" disabled={isLoading}>
          Add Funds
        </Button>
      </Box>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {isLoading && <div>Loading...</div>}
    </Container>
  );
}

export default StripeChargeComponent;
