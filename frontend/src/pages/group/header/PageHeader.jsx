import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { Box, Typography, Container, useTheme } from '@mui/material';
import { useGroupData } from '../../../context/groupData/GroupDataProvider';

export default function PageHeader() {
    const { groupId } = useParams(); // Extract groupId from URL
    const { groups } = useGroupData();
    const theme = useTheme();

    // Find the group by groupId
    const group = groups.find(group => group.id.toString() === groupId);

    // Conditional rendering based on if the group is found
    return (
        <Container maxWidth="md" sx={{ mt: 4,   }}>
            {group ? (
                <Box
                    key={group.id}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingBottom: 2,
                        // borderBottom: `1px solid ${theme.palette.primary.dark}`,
                        // '&:not(:last-child)': {
                        //     mb: 4,
                        // },
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        {group.name.toUpperCase()}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {group.description}
                    </Typography>
                </Box>
            ) : (
                <Typography variant="h6" color="textSecondary">
                    Group not found.
                </Typography>
            )}
        </Container>
    );
}
