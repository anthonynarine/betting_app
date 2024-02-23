import React, { useState, useEffect } from "react"
import useCrud from "../../../services/useCrud"
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@mui/material';
import EventRow from "./EventRow";

const UserEvents = () => {
    const [userEvents, setUserEvents] = useState([]);
    const { fetchData } = useCrud();

    useEffect (()=> {
        const fetchLoggedInUserEvents = async () => {
            try {
                const userEvents = await fetchData(`/events/user_events/`);
                setUserEvents(userEvents)
                
            } catch (error) {
                console.error("Failed to fetch user events:", error);
                // TODO  update the UI to inform the user about the error
            }
        };
        fetchLoggedInUserEvents();

    },[]);

    return (
        <>
            <TableContainer component={Paper} sx={{ width: '80%', maxWidth: "sm", mx: 'auto', my: 2, mt: 7 }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Events</TableCell>
                        <TableCell>Available Balance</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {userEvents.map((event) => (
                        <EventRow key={event.id} event={event} />
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )

}

export default UserEvents;