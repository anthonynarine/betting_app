import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCrud from "../../services/useCrud";

// === Context Creation ===
// Create a new context for API data
export const EventDataContext = createContext();

// Custom hook to use the EventDataProvider
export const useEventData = () => {
    const context = useContext(EventDataContext);
    // ensure the hook is used within a provider
    if(!context) {
        throw new Error("useEventData must be used within a EventProovider")
    }
    return context;
};
export default EventDataContext


// === Provider Creation ===
// The Provider component that wraps parts of the app
export const EventDataProvider = ({ children }) => {
    console.log("GroupDataProvider is re-rendering"); // DEBUG TEST

    const { groupId } = useParams();
    const userId = localStorage.getItemI("userId");

    const { apiData, fetchData } = useCrud([], `/groups/${groupId}`);
}
