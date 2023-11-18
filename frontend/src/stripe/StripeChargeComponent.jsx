import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
// import { useAuthServices } from "../context/Auth/AuthServices";
// import { useUserServices } from "../context/user/UserServices";
import { Button, Box, Typography, Container } from "@mui/material";

function StripeChargeComponent() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const [amount, setAmount] = useState("");
  // const { updateUserDetial } = useAuthServices();

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
        // call updaateUserDetails to update user's availabe funds
        // await updateUserDetial();
        setIsloading(false);
      }
    } catch (error) {
      setError("An error occurred while processing the payment.");
      setIsloading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in USD"
        />
        <button type="submit" disabled={!stripe || loading}>
          Pay
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </>
  );
}

export default StripeChargeComponent;
