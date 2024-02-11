import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCrud from "../../services/useCrud";

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
  const { fetchData, updateObject } = useCrud();

  //State needed for Events
  const [loading, setIsLoading] = useState(false);
  const [error, setError]  = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [allUserEvent, setAllUserEvents] = useState([]);
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [organizer, setOrganizer] = useState(null);
  
  // Function to check if the logged-in user is the organizer
  const userIsEventCreator = parseInt(localStorage.getItem("userId"), 10) === organizer;
  // console.log(typeof(userIsEventCreator))


    const fetchAllAndUserEvents = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData("/events/all_and_user_events/");
        setAllEvents(data.all_events); // Correctly set all events ordered by most participants
        setAllUserEvents(data.user_events || []); // Sets user events if a user is logged in; defaults to empty if undefined.
      } catch (error) {
        console.error("Error fetching all and user events:", error);
        setError(error);
        setIsLoading(false);
      }
    };
  
    const fetchEventData = async (id) => {
      setIsLoading(true); 
        try {
          const data = await fetchData(`/events/${id || eventId}`);
          setEvent(data);
          setGroup(data.group);
          setParticipants(data.participants);
          setOrganizer(data.organizer);
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
    

  // Function to update event data
  const updateEventData = (updatedEventData) => {
    setEvent(updatedEventData); // Directly update the context with the provided data
    console.log("Event data updated in context");
}

  const value = {
    allEvents,
    allUserEvent,
    event, 
    eventId,
    group,
    participants,
    organizer,
    userIsEventCreator,
    updateEventData,
    error,
    loading
  };

  return (
    <EventDataContext.Provider value={value}>
        { children }
    </EventDataContext.Provider>
  )

};