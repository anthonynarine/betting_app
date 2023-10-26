import React, { createContext, useContext, useEffect, useState } from "react";
import useCrud from "../../services/useCrud";
import { useParams } from "react-router-dom";

// Context creation
export const ApiDataContext = createContext();

//
export const useApiData = () => {
    const context = useContext(ApiDataContext);
    if(!context) {
        throw new Error("useApiData must be used within a MemberProvider ")
    }
    return context;
}
export default ApiDataContext;

// Provider Creation
export const ApiDataProvider = ({ children }) => {
  const { groupId } = useParams();
  const apiEndpoint = groupId ? `/groups/${groupId}/` : "/groups/";
  const { apiData, fetchData, isLoading, error } = useCrud([], apiEndpoint);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const data = await fetchData(accessToken);
        setEvents(data.events);
        setMembers(data.members);
        setGroups(data.groups)
      } catch (error) {
        console.error("Error fetchign group data:", error);
      }
    };
    fetchGroupData();
  }, [groupId, groups, events, members]); // Refetches data on groupId changes

  const updateEvents = (newEvents) => {
    setEvents(newEvents);
  };

  const updateMembers = (newMembers) => {
    setMembers(newMembers);
  };

  const value = {
    apiData,
    groups,
    setGroups,
    events,
    setEvents,
    members,
    setMembers,
    updateEvents,
    updateMembers,
    groupId,
  };

  return <ApiDataContext.Provider value={value}>{children}</ApiDataContext.Provider>;
};
