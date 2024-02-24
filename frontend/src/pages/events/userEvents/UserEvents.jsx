import React, { useState, useEffect } from "react";
import useCrud from "../../../services/useCrud";
import { useMediaQuery, useTheme, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Typography } from '@mui/material';
import EventRow from "./EventRow";

const UserEvents = () => {
    const [userEvents, setUserEvents] = useState([]);
    const { fetchData } = useCrud();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchLoggedInUserEvents = async () => {
            try {
                const userEventsData = await fetchData(`/events/user_events/`);
                setUserEvents(userEventsData);
            } catch (error) {
                console.error("Failed to fetch user events:", error);
                // Consider adding user feedback for the error
            }
        };
        fetchLoggedInUserEvents();
    }, []);

    return (
        <TableContainer component={Paper} sx={{
            maxWidth: { xs: '100%', sm: 600, md: 675 },
            mx: 'auto',
            my: 2,
            mt: 7,
        }}>
            <Table aria-label="collapsible table">
                <TableHead sx={{ backgroundColor: "black"}} >
                    <TableRow >
                        <TableCell /> {/* Adjust the width as needed */}
                        {isSmallScreen ? (
                            // For small screens: Center "Events" in the TableCell
                            <TableCell  align={isSmallScreen ? "left" : "left"} colSpan={isSmallScreen ? 1 : 3} >Events</TableCell>
                        ) : (
                            // For larger screens: Evenly distribute "Events" and "Available Balance"
                            <>
                                <TableCell></TableCell>
                                <TableCell><Typography sx={{color: theme.palette.secondary.contrastText}} variant="h6">Events</Typography></TableCell>
                                <TableCell></TableCell>
                            
                            </>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userEvents.map((event) => (
                        <EventRow key={event.id} event={event} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserEvents;


