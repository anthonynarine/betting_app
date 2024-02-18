import React, { useState, useEffect } from "react";
import { IconButton, Snackbar, Grow, Stack, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useGroupData } from '../../../context/groupData/GroupDataProvider';
import useCrud from '../../../services/useCrud';

export const MembershipToggleButton = ({ groupId }) => {
    const [isMember, setIsMember] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Context and CRUD operations
    const { groups, userId, fetchAllGroupsData } = useGroupData();
    const { createObject } = useCrud();

    useEffect(() => {
        const userIdToNumber = +userId;
        const groupFind = groups.find(group => group.id === groupId);
        const isMemberStatus = groupFind?.members.some(member => member.user.id === userIdToNumber);
        setIsMember(isMemberStatus);
    }, [groups, groupId, userId]);

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const handleToggleMembership = async () => {
        try {
            const actionPath = isMember ? `/groups/${groupId}/leave/` : `/groups/${groupId}/join/`;
            await createObject(actionPath, {});
            
            await fetchAllGroupsData(); // Refetch to ensure UI is updated
            
            setSnackbarMessage(isMember ? "Sad to see you go" : "Welcome to the group!");
            setIsMember(prev => !prev); // Toggle membership status
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error toggling membership:", error);
            setSnackbarMessage("Failed to update membership");
            setOpenSnackbar(true);
        }
    };

    return (
        <>
            <Stack direction="row">
                <IconButton aria-label="Group Button" onClick={handleToggleMembership} sx={{ margin: "0px", padding: "0px" }}>
                    {isMember ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineOutlinedIcon />}
                </IconButton>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ ml: ".4rem", mr: ".5rem" }}>
                    {isMember ? "Leave Group" : "Join Group"}
                </Typography>
            </Stack>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                TransitionComponent={Grow}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </>
    );
};
