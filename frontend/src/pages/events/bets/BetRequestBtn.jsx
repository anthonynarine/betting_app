import React, { useState } from "react";
import { Button } from "@mui/material";
import useCrud from "../../../services/useCrud";
import { useBetData } from "../../../context/bet/BetDataProvider";

const BetRequest = ({ betDetails, onSuccess, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { createObject } = useCrud(); // Use the createObject function from useCrud
    const { updateBetList, updateIndividualBet } = useBetData();


    const createBet = async () => {
        setIsLoading(true);
        try {
            // Use the createObject method from useCrud
            const newBet = await createObject('/bets/', betDetails);
            setIsLoading(false);
            onSuccess(newBet); // Pass the new bet data to the onSuccess handler
            updateBetList();  // Update BetList (ui)
            updateIndividualBet(newBet.id) // Update BetDetails card (ui)
            console.log("Printing bet details:", betDetails)
        } catch (error) {
            console.error('Error placing bet:', error);
            setIsLoading(false);
            onError(error); // Pass the error to the onError handler
        }
    };

    return (
        <>
            <Button onClick={createBet} disabled={isLoading}>
                {isLoading ? "Placing Bet..." : "Confirm Bet"}
            </Button>
        </>
    );
};

export default BetRequest;
