import React from "react";
import { IconButton } from "@mui/material"; 
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EditIcon from '@mui/icons-material/Edit';
import useCrud from "../../services/useCrud";
import { useGroupData } from "../../context/groupData/GroupDataProvider";
import { useEventData } from "../../context/eventData/EventDataProvider";

const EventActions = ({ event, toggleEventForm, onDelete }) => {

    const now = new Date();
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    const eventHasStarted = now >= startTime;
    const eventHasEnded = now >= endTime;

    return(
        <>
            <IconButton
                aria-label="delete"
                onClick={onDelete}
                disabled={eventHasStarted || (eventHasEnded && !event.is_complete)}
            >
                <DeleteSweepIcon />
            </IconButton>
            <IconButton
                aria-label="update"
                onClick={toggleEventForm}
                disabled={eventHasStarted || eventHasEnded}
            >
                <EditIcon />
            </IconButton>
        </>
    )
}

export default EventActions