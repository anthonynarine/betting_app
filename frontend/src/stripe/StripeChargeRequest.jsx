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
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { StripeStyles } from "./StripeStyles";
import { useUserServices } from "../context/user/UserContext";
import useAxiosWithInterceptorJwt from "../services/jwtinterceptor-jwtReq";
import useFetchStripeKey from "./FetchStripeKeyRequest";
import { loadStripe } from "@stripe/stripe-js";


function StripeChargeComponent() {
  const theme = useTheme();
  const classes = StripeStyles(theme);
  const isLargeScreen = useMediaQuery("(min-width: 800px)");

  const stripe = useStripe();
  const elements = useElements();

  const { stripePublicKey } = useFetchStripeKey();
  const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");

  const { fetchUserData } = useUserServices();
  const jwtReqAxios = useAxiosWithInterceptorJwt();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
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

      // Use jwtAxios for making the post request
      const response = await jwtReqAxios.post("/stripe/charge/", {
        amount: parseInt(amount) * 100, // Convert dollars to cents
        source: paymentMethod.id,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setError("An error occurred while processing the payment.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <Container maxWidth={isLargeScreen ? "xs" : "sm"} sx={classes.container}>
            <Box alignItems="center" textAlign="center" sx={classes.box1}>
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
                />
                <Box sx={classes.card_element_box}>
                  <CardElement />
                </Box>
                <Button variant="contained" color="primary" fullWidth type="submit">
                  Add Funds
                </Button>
              </Box>
            </Box>
          </Container>
        </Elements>
      ) : (
        <div>Loading Stripe...</div> // Or any other placeholder/loading indicator
      )}
    </>
  );
}

export default StripeChargeComponent;
