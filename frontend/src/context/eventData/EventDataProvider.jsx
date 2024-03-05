import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCrud from "../../services/useCrud";
import { useCallback } from "react";

//  To Use this context 
//  import { useEventData } from "somedir"
// const { updateGroupData } = useEventData();  Access the treasures 

// === Context Creation ===
// Create a new context for API data
export const EventDataContext = createContext();

// Custom hook to use the EventDataProvider
export const useEventData = () => {
  const context = useContext(EventDataContext);
  // ensure the hook is used within a provider
  if (!context) {
    throw new Error("useEventData must be used within an EventProvider");
  }
  return context;
};
export default EventDataContext;


export const EventDataProvider = ({ children }) => {
  // console.log("EventDataProvider is re-rendering"); // DEBUG TEST
  const { eventId } = useParams();
  const { fetchData } = useCrud();

  //State needed for Events
  const [loading, setIsLoading] = useState(false);
  const [error, setError]  = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [allUserEvents, setAllUserEvents] = useState([]);
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState([]);
  const [participants, setParticipants] = useState([]);

  
  const fetchAllAndUserEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchData("/events/all_and_user_events/");
      setAllEvents(data.all_events);
      setAllUserEvents(data.user_events || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all and user events:", error);
      setError(error);
      setIsLoading(false);
    }
  }, []);
  
  const fetchEventData = async (id) => {
    setIsLoading(true); 
      try {
        const data = await fetchData(`/events/${id || eventId}`);
        setEvent(data);
        setGroup(data.group);
        setParticipants(data.participants);
        // Removed the console.log from here as organizer might not be updated immediately due to setState being asynchronous
      } catch (error) {
        console.error("Error fetching event data by ID:", error);
        setError(error);
        setIsLoading(false);
    }
  };

  useEffect(()=> {
    fetchAllAndUserEvents();
    if (eventId) {
      fetchEventData(eventId)
    }
  }, [eventId])
  

  const value = {
    allEvents,
    allUserEvents,
    event, 
    eventId,
    group,
    participants,
    error,
    loading,
    fetchAllAndUserEvents,
  };

  return (
    <EventDataContext.Provider value={value}>
        { children }
    </EventDataContext.Provider>
  )

};