import React, { createContext, useContext, useEffect, useState } from "react"
import useCrud from "../../services/useCrud"


//=== Context Creation ===
// Create a new context for Bet data
export const BetDataContexst = createContext();


// Custom hook to use BetDataProvider
export const useBetData = () => {
    const context = useContext(BetDataContexst);
    // Ensure the hoook is used within a provider
    if (!context) {
        throw new Error("useBetData must be used within an BetProvider");
    }
    return context;
};
export default BetDataContexst


//== Provider Creation ===
// The Provider component that wraps parts of the app
export const BetDataProvider = ({ children }) => {
    console.log("BetDataProvider is rendeering")  // DEBUG TEST

    // 
    const { fetchData } = useCrud();

    //State needed for Bets
    const [bets, setBets] = useState([])

}