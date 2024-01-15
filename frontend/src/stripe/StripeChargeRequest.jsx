// StripeChargeComponent.jsx
import React, { useState } from "react";
import {
  useTheme,
  Container,
  useMediaQuery,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
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
    <Container sx={classes.flexContainer}>
      <Container maxWidth={isLargeScreen ? "xs" : "sm"} sx={classes.container}>
        <Typography variant="h5" gutterBottom textAlign="center" sx={{mt: 3}}>
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
            sx={classes.textField} // Apply custom TextField style
          />
          <Box sx={classes.card_element_box}>
            <CardElement />
          </Box>
          <Button variant="contained" fullWidth type="submit" disabled={isLoading} sx={classes.button}>
            Add Funds
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {isLoading && <Alert severity="info">Loading...</Alert>}
      </Container>
    </Container>
  );
}

export default StripeChargeComponent;
