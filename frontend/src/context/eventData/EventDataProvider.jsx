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
  const { fetchData, updateObject, deleteObject } = useCrud();

  //State needed for Events
  const [loading, setIsLoading] = useState(false);
  const [error, setError]  = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [allUserEvents, setAllUserEvents] = useState([]);
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState([]);
  const [participants, setParticipants] = useState([]);

  
// Function to determine the actions that can be performed on an event based on its start and end times
const checkEventActions = (event) => {
  const now = new Date();
  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);
  
  // Check if the current time is equal to or after the event's start time
  const eventHasStarted = now >= startTime;
  // Check if the current time is equal to or after the event's end time
  const eventHasEnded = now >= endTime;

  // An event cannot be updated if it has already started or ended.
  const canUpdate = !(eventHasStarted || eventHasEnded);
  // An event cannot be deleted if it has started or if it has ended and is marked as complete.
  const canDelete = !(eventHasStarted || (eventHasEnded && !event.is_complete));

  return {
    canUpdate, canDelete };
};


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
  

  // Function to update event 
  const updateEvent = async (eventId, updatedEventData) => {
    try {
      await updateObject("/events/", eventId, updatedEventData)
      fetchAllAndUserEvents(); // Update UI state
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await deleteObject("/events/", eventId);
      fetchAllAndUserEvents(); // Update UI state
    } catch (error) {
      console.error("Failded to delete event:", error);
    }
  };



  const value = {
    allEvents,
    allUserEvents,
    event, 
    eventId,
    group,
    participants,
    updateEvent,
    deleteEvent,
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