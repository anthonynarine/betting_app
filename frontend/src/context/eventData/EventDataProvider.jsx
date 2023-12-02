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
  console.log("GroupDataProvider is re-rendering"); // DEBUG TEST

  const { eventId } = useParams();
  const { fetchData } = useCrud([], `/events/${eventId}`);

  //State to needed for Events
  const [event, setEvent] = useState([]);
  const [group, setGroup] = useState([]);
  const [participants, setParticipants] = useState([]);

  // Feth event data when eventId changes

  useEffect(() => {
    if (eventId) {
      const fetchEventData = async () => {
        // const accessToken = localStorage.getItem("accessToken"); // 
        try {
          const data = await fetchData();
          setEvent(data);
          setGroup(data.group);
          setParticipants(data.participants);
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
      fetchEventData();
    }
  }, [eventId]);


  // const updateEventList = (newEventData) => {
  //   console.log("updatingGroupData function called")
  //   setEvents((preEvents) => [...preEvents, newEventData]);
  // }



  const value = {
    event, 
    eventId,
    group,
    participants,
  };

  return (
    <EventDataContext.Provider value={value}>
        { children }
    </EventDataContext.Provider>
  )

};
