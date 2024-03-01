import { useMediaQuery, IconButton, useTheme, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Typography, Box, Toolbar, TableFooter } from '@mui/material';
import EventRow from "./EventRow";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import { useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PaginationComponet from '../../../components/pagination/PaginationComponent';
import UserEventListToolBar from './UserEventListToolBar';

const UserEvents = () => {
    const { allUserEvents: events } = useEventData()
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    //Pagination functionality
    const [currentPageEvents, setCurrentPageEvents] = useState([]);

    const itemsPerPage = 5;

    // Calculate the total num of blank rows needed to fill the page
    const blankRowsCount = currentPageEvents.length < itemsPerPage ? itemsPerPage - currentPageEvents.length : 0;

    // Callback function to update the current items based on page chagne
    const handleChagePage = (page) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        setCurrentPageEvents(events.slice(start, end));
    };


    
    return (
        <Box>
            <TableContainer component={Paper} elevation={20} sx={{
                maxWidth: { xs: '100%', sm: 600, md: 675 },
                mx: 'auto',
                my: 2,
                mt: 3,
                minHeight: 40,
            }}>
                <UserEventListToolBar />
                <Table aria-label="collapsible table">
                <TableBody  sx={{ borderTop: "1.5px solid black"}}>
                    {currentPageEvents.map((event, index) => (
                        <EventRow key={event.id} event={event} />
                    ))}
                    {/* Render blank rows if needed to fill the page */}
                    {Array.from({ length: itemsPerPage - currentPageEvents.length }, (_, index) => (
                        <TableRow key={`blank-${index}`}>
                            <TableCell colSpan={4} style={{ height: 70}}> </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter sx={{bg: "black"}} >
                    <TableRow >
                        {/* You can adjust the colspan as per your table structure */}
                        <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                        </TableCell>
                    </TableRow>
                </TableFooter>
                
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


