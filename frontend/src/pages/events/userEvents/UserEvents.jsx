import { useMediaQuery, IconButton, useTheme, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Typography, Box } from '@mui/material';
import EventRow from "./EventRow";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import { useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PaginationComponet from '../../../components/pagination/PaginationComponent';

const UserEvents = () => {
    const { allUserEvents: events } = useEventData()
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    //Pagination functionality
    const [currentPageEvents, setCurrentPageEvents] = useState([]);

    const itemsPerPage = 5;

    // Callback function to update the current items based on page chagne
    const handleChagePage = (page) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        setCurrentPageEvents(events.slice(start, end));
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
                        {currentPageEvents.map((event, index) => (
                            <EventRow key={event.id} event={event}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PaginationComponet
                totalItems={events.length}
                itemsPerPage={itemsPerPage}
                onChangePage={handleChagePage}
            />
        </Box>
        
    );
};

export default UserEvents;


