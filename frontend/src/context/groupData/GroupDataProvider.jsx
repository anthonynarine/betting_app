import React, { createContext, useContext, useEffect, useState } from "react";
import useCrud from "../../services/useCrud";
import { useParams } from "react-router-dom";

// === Context Creation ===
// Create a new context for API data
export const GroupDataContext = createContext();

// Custom hook to use the GroupDataContext
export const useGroupData = () => {
  const context = useContext(GroupDataContext);
  // Ensure the hook is used within a Provider
  if (!context) {
    throw new Error("useApiData must be used within a MemberProvider");
  }
  return context;
};

// Export the context for use in other components
export default GroupDataContext;

// === Provider Creation ===
// The Provider component that wraps parts of the app
export const GroupDataProvider = ({ children }) => {
  console.log("GroupDataProvider is re-rendering"); // DEBUG TEST
  // Get the groupId from the URL
  const { groupId } = useParams();
  const userId = localStorage.getItem("userId");

  // Determine the API endpoint based on the groupId
  // const apiEndpoint = groupId ? `/groups/${groupId}/` : "/groups/";

  // Use the custom CRUD hook to fetch data
  const { fetchData, isLoading, error } = useCrud();

  // State variables for events, members, and groups
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState([]);
  const [groups, setGroups] = useState([]);

  // Fetch group data when groupId changes

  useEffect(() => {
    if (groupId) {
      const fetchSingleGroupData = async () => {
        try {
          const data = await fetchData(`/groups/${groupId}`);
          setGroup(data);
          setEvents(data.events || []);
          setMembers(data.members || []);
        } catch (error) {
          console.error("Error fetching single group data", error);
        }
      };
      fetchSingleGroupData();
    }
  }, [groupId]);

  useEffect(() => {
    if (!groupId) {
      const fetchAllGroupsData = async () => {
        try {
          const allGroupsData = await fetchData("/groups");
          setGroups(allGroupsData);
        } catch (error) {
          console.error("Error fetching all groups data", error);
        }
      };
      fetchAllGroupsData();
    }
  }, [groupId]);

  useEffect(() => {
    console.log("Current Member State: ", members);
  }, [members]);

  
  const updateGroup = (newGroup) => {
    setGroup(newGroup);
  };

  const updateGroups = (groupId, action, memberData) => {
    console.log(`updateGroups called with groupId: ${groupId}, action: ${action}, and memberData:`, memberData);

    setGroups((currentGroups) => {
        return currentGroups.map((group) => {
            if (group.id === groupId) {
              let updatedMembers = [...group.members];
                if (action === "join") {
                  const isAlreadyMember = updatedMembers.some(member => member.user.id === memberData.user.id)
                  if(!isAlreadyMember) {
                    console.log(`Adding member to group with ID: ${groupId}`);
                    updatedMembers.push(memberData);
                    console.log(`Updated members after adding:`, updatedMembers);
                  }
                } else if (action === "leave") {
                    console.log(`Removing member from group with ID: ${groupId}`);
                    updatedMembers = updatedMembers.filter(member => member.user.id !== memberData.user.id);
                    console.log(`Updated members after removing:`, updatedMembers);
                }
                return { ...group, members: updatedMembers };
            }
            return group;
        });
    });
};
  

  const updateMembers = (newMembers) => {
    console.log("New members to set:", newMembers);
    setMembers(newMembers);
  };

  const updateEventList = (newEventData) => {
    console.log("updatingGroupData function called")
    setEvents((preEvents) => [...preEvents, newEventData]);
  };



  // The value that will be available to components wrapped in this Provider
  const value = {
    userId,
    groupId,
    group,
    groups,
    setGroup,
    updateGroup,
    updateGroups,
    events,
    members,
    setMembers,
    updateMembers,
    updateEventList
  };

  // Provide the value to the children components
  return <GroupDataContext.Provider value={value}>{children}</GroupDataContext.Provider>;
};
