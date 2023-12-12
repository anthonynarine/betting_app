import { TextField, Box } from "@mui/material";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const StripeForm = ({ onSubmit, loading, error }) => {

    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] =useState("");
    const [error, setError] =useState(false)

    // Handle form submission when the user clicks the Add Funds btn
    let handleSubmit = async (event) => {
        event.preventDefault();
        // Check if the Stripe Elements are available
        if (!stripe || !elements){
            return;
        };
    
        //Get the CardElements from Elements
        let cardElement = elements.getElement(CardElement);
    
        //Create a payment method using the card details
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            setIsloading(false);
            return;
          }
    

    };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        label="Amount in USD"
        variant="outlined"
        fullWidth
        type="number"
        id="amount"
        name="amount"
        autoFocus
        value={amount}
        onChange={(e) => setAmount(e.target.value)}

      </Box>
    </>
  );
};
export default StripeForm;
