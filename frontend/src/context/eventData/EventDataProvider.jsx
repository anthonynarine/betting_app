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
  if (!context) {
    throw new Error("useEventData must be used within an EventProovider");
  }
  return context;
};
export default EventDataContext;

// === Provider Creation ===
// The Provider component that wraps parts of the app
export const EventDataProvider = ({ children }) => {
  console.log("GroupDataProvider is re-rendering"); // DEBUG TEST

  const { eventId } = useParams();
  const { fetchData } = useCrud([], `/groups/${eventId}`);

  //State to needed for Events
  const [events, setEvents] = useState([]);
  const [group, setGroups] = useState([]);
  const [participants, setParticipants] = useState([]);

  // Feth event data when eventId changes

  useEffect(() => {
    if (eventId) {
      const fetchEventData = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
          const data = await fetchData(accessToken);
          setEvents(data);
          setGroups(data.group);
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
      fetchEventData();
    }
  }, [eventId]);
};
