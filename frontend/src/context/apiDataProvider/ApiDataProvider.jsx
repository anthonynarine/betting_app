import React, { createContext, useContext, useEffect, useState } from "react";
import useCrud from "../../services/useCrud";
import { useParams } from "react-router-dom";

// === Context Creation ===
// Create a new context for API data
export const ApiDataContext = createContext();

// Custom hook to use the ApiDataContext
export const useApiData = () => {
  const context = useContext(ApiDataContext);
  // Ensure the hook is used within a Provider
  if (!context) {
    throw new Error("useApiData must be used within a MemberProvider");
  }
  return context;
};

// Export the context for use in other components
export default ApiDataContext;

// === Provider Creation ===
// The Provider component that wraps parts of the app
export const ApiDataProvider = ({ children }) => {
  console.log("ApiDataProvider is re-rendering"); // DEBUG TEST
  // Get the groupId from the URL
  const { groupId } = useParams();
  const userId = localStorage.getItem("userId");

  // Determine the API endpoint based on the groupId
  const apiEndpoint = groupId ? `/groups/${groupId}/` : "/groups/";

  // Use the custom CRUD hook to fetch data
  const { apiData, fetchData, isLoading, error } = useCrud([], `/groups/${groupId}`);

  // State variables for events, members, and groups
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState([]);

  // Fetch group data when groupId changes
  useEffect(() => {
    if (groupId) {
      const fetchGroupData = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
          const data = await fetchData(accessToken);
          setEvents(data.events);
          setMembers(data.members);
          setGroup(data);
          console.log("Groups DATA ApiDataProvider:", data); // CONSOLE TEST
        } catch (error) {
          console.error("Error fetching group data:", error);
        }
      };
      fetchGroupData();
    }
  }, [groupId]); // refetches data when groupId changes

  useEffect(() => {
    console.log("Current Member State: ", members);
  }, [members]);

  // Functions to update events, members, and groups
  const updateEvents = (newEvents) => {
    setEvents(newEvents);
  };
  const updateMembers = (newMembers) => {
    console.log("New members to set:", newMembers);
    setMembers(newMembers);
  };
  const updateGroup = (newGroup) => {
    setGroup(newGroup);
  };

  // The value that will be available to components wrapped in this Provider
  const value = {
    apiData,
    userId,
    groupId,
    group,
    setGroup,
    updateGroup,
    events,
    setEvents,
    updateEvents,
    members,
    setMembers,
    updateMembers,
  };

  // Provide the value to the children components
  return <ApiDataContext.Provider value={value}>{children}</ApiDataContext.Provider>;
};
