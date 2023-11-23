import React, { useState } from "react";
import {
  useTheme,
  Button,
  Box,
  Typography,
  Container,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { StripeStyles } from "./StripeStyles";
import { useUserServices } from "../context/user/UserContext";


function StripeChargeComponent() {
  const theme = useTheme();
  const classes = StripeStyles(theme);
  const isLargeScreen = useMediaQuery("(min-width: 800px)");

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const [amount, setAmount] = useState("");
  const { fetchUserData } = useUserServices();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if stripe and elements objects are available
    if (!stripe || !elements) {
      return;
    }

    setIsloading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setIsloading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${BASE_URL}/stripe/charge/`,
        {
          amount: parseInt(amount) * 100, // Convert dollars to cents
          source: paymentMethod.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        fetchUserData()  // Refetch data // to updated ui
        setIsloading(false);
      }
    } catch (error) {
      setError("An error occurred while processing the payment.");
      setIsloading(false);
    }
  };

  return (
    <>
      <Container
        maxWidth={isLargeScreen ? "xs" : "sm"}
        sx={classes.container}
      >
        <Box
          alignItems="center"
          textAlign="center"
          sx={classes.box1}
        >
          <Typography variant="h5" gutterBottom>
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
              // Add state and onChange handler for this field
            />

            <Box
              sx={classes.card_element_box}
            >
              <CardElement />
            </Box>

            <Button variant="contained" color="primary" fullWidth type="submit">
              Add Funds
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default StripeChargeComponent;
