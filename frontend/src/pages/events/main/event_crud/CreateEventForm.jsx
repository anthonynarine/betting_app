import React, { useState } from "react";
import { useEventData } from "../../../../context/eventData/EventDataProvider";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const CreateEventForm = ({ openCreateEventForm, toggleCreateEventForm }) => {
  // State for managing event input
  const [eventDetails, setEventDetails] = useState({
    team1: "",
    team2: "",
    start_time: "", // You may want to use a DatePicker component for date and time selection
    end_time: "", // You may want to use a DatePicker component for date and time selection
  });

  const handleInputChange = (event) => {
    setEventDetails({ ...eventDetails, [event.target.name]: event.target.value });
  };

  const handleSuccess = (data) => {
    console.log("Event created:", data);
    toggleCreateEventForm();
  };

  const handleError = (error) => {
    console.error("Error creating event:", error);
  };

  const handleSubmit = () => {
    // Add logic here to send a POST request with eventDetails to create an event
    // You can use Axios or your preferred method for API calls
    // After successfully creating the event, call handleSuccess
    // After handling any errors, call handleError
  };

  return (
    <Dialog
      open={openCreateEventForm}
      onClose={toggleCreateEventForm}
      aria-labelledby="form-dialog-title"
      PaperProps={{
        style: {
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "400px", // Adjust the width as needed
        },
      }}
    >
      {/* Dialog Title */}
      <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
        Create Event
      </DialogTitle>
      <DialogContent>
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
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEventForm;
