// Import necessary components and hooks
import React from 'react';
import { Grid, Box } from '@mui/material';
import GroupCardV2 from './GroupCardV2';
import { useGroupData } from '../../context/groupData/GroupDataProvider';

export default function GroupsList() {
    const { groups } = useGroupData();
    console.log("testing", groups)

    return (
        <Box>
            <Grid container spacing={3} >
                {groups.map((group) => (
                    <Grid item key={`group-${group.id}-${group.members.length}`} xs={12} sm={12} md={12} lg={12} display="flex" justifyContent="center" alignItems="center" >
                        <GroupCardV2 group={group} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}