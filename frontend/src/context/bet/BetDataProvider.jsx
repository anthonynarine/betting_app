import React, { createContext, useContext, useEffect, useState } from "react"
import useCrud from "../../services/useCrud"
import { useParams } from "react-router-dom";


//=== Context Creation ===
// Create a new context for Bet data
export const BetDataContext = createContext();


// Custom hook to use BetDataProvider
export const useBetData = () => {
    const context = useContext(BetDataContext);
    // Ensure the hoook is used within a provider
    if (!context) {
        throw new Error("useBetData must be used within an BetProvider");
    }
    return context;
};
export default BetDataContext


//== Provider Creation ===
// The Provider component that wraps parts of the app
export const BetDataProvider = ({ children }) => {
    console.log("BetDataProvider is rendeering")  // DEBUG TEST

    // 
    const { fetchData } = useCrud();
    let{ eventId } = useParams();
    console.log("EVENT ID TEST:", eventId)

    //State needed for all Bets by the logged in user
    const [bets, setBets] = useState([]);
    const [individualBet, setIndividualBet] = useState([]);

    // Fetch bet all bets for logged in user
    useEffect(()=>{
        const fetchAllBets = async () => {
            try {
                const allBetsData = await fetchData("/bets/")
                setBets(allBetsData);
                console.log("All USERS bets DATA in context", allBetsData); 
            } catch (error) {
                console.error("Error fetching bets:", error);
            }
        };

        const fetchIndividualBet = async () => {
            try {
                const individualBetData = await fetchData(`/bets/event-bet/?event_id=${eventId}`);
                setIndividualBet(individualBetData);
                console.log("INDIVIDUAL BET DATA in context:", individualBetData, eventId)
            } catch (error) {
                console.error("Error fetching bet:", error)
            }
        };

        fetchAllBets();
        if (eventId) {
            fetchIndividualBet();
        }
    },[eventId]);

    return (
        <BetDataContext.Provider value={{bets, individualBet}}>
            { children }
        </BetDataContext.Provider>
    )
};