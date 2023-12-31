import React, { createContext, useContext, useEffect, useState } from "react";
import useCrud from "../../services/useCrud";
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
export default BetDataContext;

//== Provider Creation ===
// The Provider component that wraps parts of the app
export const BetDataProvider = ({ children }) => {
  console.log("BetDataProvider is rendeering"); // DEBUG TEST

  //
  const { fetchData } = useCrud();
  let { eventId } = useParams();
  console.log("EVENT ID TEST:", eventId);

  //State needed for all Bets by the logged in user
  const [bets, setBets] = useState([]);
  const [individualBet, setIndividualBet] = useState(null);

  // Fetch bet all bets for logged in user
  useEffect(() => {
    const fetchAllBets = async () => {
      try {
        const allBetsData = await fetchData("/bets/");
        setBets(allBetsData);
        console.log("All USERS bets DATA in context", allBetsData);
      } catch (error) {
        console.error("Error fetching bets:", error);
      }
    };

    const fetchIndividualBet = async () => {
      try {
        const individualBetData = await fetchData(
          `/bets/event-bet/?event_id=${eventId}`
        );
        setIndividualBet(individualBetData);
        console.log("INDIVIDUAL BET DATA in context:",individualBetData,eventId);
      } catch (error) {
        if (error.resaponse && error.response.status === 404) {
          setIndividualBet(null);
        } else {
          console.error("Error fetching bet:", error);
        }
      }
    };

    fetchAllBets();
    if (eventId) {
      fetchIndividualBet();
    }
  }, [eventId]);

  const updateBetList = async () => {
    try {
      const allBetsData = await fetchData("/bets/");
      setBets(allBetsData);
    } catch (error) {
      console.error("Error refreshing bets", error);
    }
  };

  const updateIndividualBet = async (betId) => {
    try {
      const updateIndividualBet = await fetchData(`/bets/${betId}`);
      setIndividualBet(updateIndividualBet);
    } catch (error) {
      console.error("Error updating individual bet:", error);
    }
  };

  const value = {
    bets,
    individualBet,
    updateBetList,
    updateIndividualBet,
  };

  return (
    <BetDataContext.Provider value={value}>{children}</BetDataContext.Provider>
  );
};
