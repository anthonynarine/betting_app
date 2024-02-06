// Import necessary components and hooks
import React from 'react';
import { Grid, Box } from '@mui/material';
import GroupCardV2 from './GroupCardV2';
import { useGroupData } from '../../context/groupData/GroupDataProvider';

export default function GroupsList() {
    const { groups, members } = useGroupData();
    console.log("testing", members)



    return (
        <Box display="flex" justifyContent="center" alignItems="center" > 
            <Grid container spacing={2} justifyContent="center">
                {groups.map((group) => (
                    <Grid item key={group.id} xs={12} sm={4} md={4} lg={3}>
                        <GroupCardV2 group={group} />
                    </Grid>
                    
                ))}
            </Grid>
        </Box>
    );
}