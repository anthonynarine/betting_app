import React, { useState } from "react";
import useAxiosWithInterceptor from "../../../../../services/jwtinterceptor-jwtNotReq";
import { Button } from "@mui/material";

const BetRequest = ({ betDetails, onSuccess, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const jwtAxios = useAxiosWithInterceptor();

    const createBet = async ()=> {
        setIsLoading(true);
        console.log("Bet details before sending:", betDetails); // bet details prior to request
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
        <Button onClick={createBet} disabled={isLoading}>
            {isLoading ? "Placing Bet..." : "Place Bet"}
        </Button>
        </>
    );
};

export default BetRequest;