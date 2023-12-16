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

// === Provider Creation ===
// The Provider component that wraps parts of the app
export const EventDataProvider = ({ children }) => {
  console.log("EventDataProvider is re-rendering"); // DEBUG TEST

  const { eventId } = useParams();
  const { fetchData, updateObject } = useCrud();

  //State to needed for Events
  const [event, setEvent] = useState([]);
  const [group, setGroup] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [organizer, setOrganizer] = useState(null);
  
  // Function to check if the logged-in user is the organizer
  const userIsEventCreator = parseInt(localStorage.getItem("userId"), 10) === organizer;
  console.log(typeof(userIsEventCreator))
  
  // Feth event data when eventId changes
  useEffect(() => {
    if (eventId) {
      const fetchEventData = async () => {
        // const accessToken = localStorage.getItem("accessToken"); // 
        try {
          const data = await fetchData(`/events/${eventId}`);
          setEvent(data);
          setGroup(data.group);
          setParticipants(data.participants);
          setOrganizer(data.organizer)
          console.log("organizer id", organizer)
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
      fetchEventData();
    }
  }, [eventId]);

  // Function to update event data
  const updateEventData = async(updatedEventData) => {
    try {
      const updatedData = await updateObject(`/events/${eventId}/`, updatedEventData)
      setEvent(updatedData) // Update event data in the state
      // Optionally , update other related fields liek group or participants
    } catch (error) {
      console.error("Error updating event data:", error);
    }
    console.log("updateEventData Called")
  }

  const value = {
    event, 
    eventId,
    group,
    participants,
    organizer,
    userIsEventCreator,
    updateEventData,
  };

  return (
    <EventDataContext.Provider value={value}>
        { children }
    </EventDataContext.Provider>
  )

};