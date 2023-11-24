import React, { useState } from "react";
import useAxiosWithInterceptor from "../../../../services/jwtinterceptor";
import { Button } from "@mui/material";

const BetRequest = ({ betDetails, onSuccess, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const jwtAxios = useAxiosWithInterceptor();

    const palaceBet = async ()=> {
        setIsLoading(true);
        try {
            const response = await jwtAxios.post('/bet/', betDetails)
            setIsLoading(false);
            onSuccess(response.data);
            
        } catch (error) {
            console.error('Error placing bet:', error);
            setIsLoading(false);
            onError(error);
            
        }
    };

    return (
        <>
        <Button onClick={palaceBet} disabled={isLoading}>
            {isLoading ? "Placing Bet..." : "Place Bet"}
        </Button>
        </>
    );
};

export default BetRequest;