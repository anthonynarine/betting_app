import React, { useState } from "react";
import { Button, } from "@mui/material";
import useCrud from "../../../services/useCrud";
import { useBetData } from "../../../context/bet/BetDataProvider";
import { useUserServices } from "../../../context/user/UserContext";



const BetRequest = ({ betDetails, onSuccess, onError, errorMessage }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { createObject } = useCrud(); // Use the createObject function from useCrud
    const { updateBetList, updateIndividualBet } = useBetData();
    const { updateUserData } = useUserServices();

    const createBet = async () => {
        setIsLoading(true);
        try {
            // Use the createObject method from useCrud
            const newBet = await createObject('/bets/', betDetails);
            setIsLoading(false);
            onSuccess(newBet); // Pass the new bet data to the onSuccess handler
            updateBetList();  // Update BetList (ui)
            updateIndividualBet(newBet.id) // Update BetDetails card (ui)
            updateUserData(); // Updates the availabe funds on user icon in primary app bar
            console.log("Printing bet details:", betDetails)
        } catch (error) {
            console.error('Error placing bet:', error);
            console.log("Received errorMessage:", errorMessage)
            setIsLoading(false);
            onError(error); // Pass the error to the onError handler
        }
    };


    return (
        <>
            <Button 
                onClick={createBet}
                disabled={isLoading} 
                variant="outlined" 
                sx={{}}
                // className={classes.confirmBetButton}
                >
                {isLoading ? "Placing Bet..." : "Confirm Bet"}
            </Button>
        </>
    );
};

export default BetRequest;
