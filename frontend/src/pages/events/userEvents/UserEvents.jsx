import { useMediaQuery, IconButton, useTheme, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Typography, Box } from '@mui/material';
import EventRow from "./EventRow";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import { useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const UserEvents = () => {
    const { allUserEvents: events } = useEventData()
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    //Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    // Calculate total pages
    const totalPages = Math.ceil(events.length / rowsPerPage);

    const handleNext = () => {
        if (page < totalPages - 1) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (page > 0) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    
    return (
        <Box>
            <TableContainer component={Paper} sx={{
                maxWidth: { xs: '100%', sm: 600, md: 675 },
                mx: 'auto',
                my: 2,
                mt: 3,
            }}>
                <Table aria-label="collapsible table">
                    <TableBody>
                        {events
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((event, index) => (
                                <EventRow
                                    key={event.id} 
                                    event={event}

                                />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-evenly" alignItems="center" p={2}>
                <IconButton onClick={handlePrevious} disabled={page === 0}>
                    <NavigateBeforeIcon />
                </IconButton>
                <Typography>
                    Page {page + 1} of {totalPages}
                </Typography>
                <IconButton onClick={handleNext} disabled={page === totalPages - 1}>
                    <NavigateNextIcon />
                </IconButton>
            </Box>
        </Box>
        
    );
};

export default UserEvents;


