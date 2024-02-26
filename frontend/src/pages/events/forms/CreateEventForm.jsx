import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import useCrud from "../../../services/useCrud";
import { useGroupData } from "../../../context/groupData/GroupDataProvider";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import { useNavigate } from "react-router-dom";


const CreateEventForm = ({ openCreateEventForm, toggleCreateEventForm, groupId}) => {
  const navigate = useNavigate();
  
  // Get the userId from local storage, this is needed to create a new event.
  const userId = localStorage.getItem("userId");
  // // Get the GroupID from the URL
  // const { groupId } = useParams();
  console.log("groupId", groupId)
  // func to update context of Event List
  const { fetchAllAndUserEvents } = useEventData();
  const { fetchAllGroupsData } = useGroupData();

  // State for managing event input
  const [eventDetails, setEventDetails] = useState({
    group_id: parseInt(groupId),
    organizer: parseInt(userId),
    team1: "",
    team2: "",
    start_time: "",
    end_time: "",
  });

  // State for managing the success message
  const [showSuccessMessage, setShowSuccessfulMessage] = useState(false);

  // Initialize the useCrud hook with the desired API URL
  const { createObject } = useCrud();

  // Event handler for input changes in the form
  const handleInputChange = (event) => {
    setEventDetails({ ...eventDetails, [event.target.name]: event.target.value });
  };

  const handleSuccess = (data) => {
    console.log("Event created:", data);
    fetchAllAndUserEvents();  // update ui in group list
    fetchAllGroupsData();
    // Close the form
    toggleCreateEventForm();
    // Show a successful message
    setShowSuccessfulMessage(true);
    // Clear the form
    setEventDetails({
      groupId: groupId,
      organizer: userId,
      team1: "",
      team2: "",
      start_time: "",
      end_time: "",
    });
  };

  // Use effect to hide the success message after a few seconds.
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessfulMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleError = (error) => {
    console.error("Error creating event:", error);
  };

  const handleSubmit = async () => {
    try {
      const createdEventObject = await createObject("/events/", eventDetails);
      handleSuccess(createdEventObject);
      navigate(`/group/${groupId}`)

    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Dialog
      open={openCreateEventForm}
      onClose={toggleCreateEventForm}
      aria-labelledby="create-event-dialog"
      PaperProps={{
        style: {
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "438.13px", // Adjust the width as needed
        },
      }}
    >
      {/* Dialog Title */}
      <DialogTitle id="create-event-dialog" style={{ textAlign: "center" }}>
        Create Event
      </DialogTitle>
      <DialogContent>
      {showSuccessMessage && (
  <DialogContent>
    <Typography color="green">Event created successfully!</Typography>
  </DialogContent>
)}
        
        {/* Team 1 Field */}
        <TextField
          autoFocus
          margin="dense"
          id="team1"
          name="team1"
          label="Team 1"
          fullWidth
          value={eventDetails.team1}
          onChange={handleInputChange}
        />
        {/* Team 2 Field */}
        <TextField
          autoFocus
          margin="dense"
          id="team2"
          name="team2"
          label="Team 2"
          fullWidth
          value={eventDetails.team2}
          onChange={handleInputChange}
        />
        {/* Start Time Field */}
        <TextField
          autoFocus
          margin="dense"
          id="start_time"
          name="start_time"
          label="Start Time"
          fullWidth
          type="datetime-local" // Use a date and time picker input
          value={eventDetails.start_time}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
        {/* End Time Field */}
        <TextField
          margin="dense"
          id="end_time"
          name="end_time"
          label="End Time"
          fullWidth
          type="datetime-local" // Use a date and time picker input
          value={eventDetails.end_time}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        {/* Cancel Button */}
        <Button onClick={toggleCreateEventForm} color="primary">
          Cancel
        </Button>
        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEventForm;
