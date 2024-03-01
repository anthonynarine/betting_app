// Pagination Components
import React, { useState, useEffect } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

/**
 * Pagination component handles the pagination logic and ui for displaying a set # of page state
 * 
 * Props:
 * - totalItems (number): The total number of items to paginate.
 * - itemsPerPage (number): The num of items to display on each page
 * - onChange(function): A callback func that is caleld w/ the new page num whenever the page changes 
 */

const PaginationComponet = ({ totalItems, itemsPerPage, onChangePage }) => {
    const [page, setPage] = useState(0);
    //Calculate the total num of pages bases on total items and items per page
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(()=>{
    // Effect to call the onChangePage callback with the current page whenever the page changes.
        onChangePage(page);
    }, [page, onChangePage]);

    // Func to handle clicking the "next" btn. Increments the page state.
    const handleNext = () => {
        if (page < totalPages - 1) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Function to handle clicking the "previous" btn.  Decrements the page state
    const handlePrevious = () => {
        if (page > 0) {
            setPage(prevPage => prevPage -1);
        }
    };

    return (
        <>        
            <Box sx={{
                maxWidth: { xs: '100%', sm: 600, md: 675 },
                mx: 'auto',
                my: 2,
                width: '100%',
                display: 'flex', 
                justifyContent: 'space-evenly', 
                alignItems: 'center', 
                p: 2
            }}>
                <IconButton onClick={handlePrevious} disabled={page === 0}>
                    <NavigateBeforeIcon />
                </IconButton>
                <Typography>Page {page + 1} of {totalPages}</Typography>
                <IconButton onClick={handleNext} disabled={page === totalPages - 1}>
                    <NavigateNextIcon />
                </IconButton>
            </Box>
        </>
    );

};
export default PaginationComponet;