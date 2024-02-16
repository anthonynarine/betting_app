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
    const { groups, userId, updateGroups } = useGroupData();
    const { createObject, deleteObject } = useCrud();

    useEffect(() => {
        console.log("Effect running: Checking membership status...");
        const userIdToNumber = +userId; // userId converted to number
        const groupFind = groups.find(group => group.id === groupId);
        const isMemberStatus = groupFind?.members.some(member => member.user.id === userIdToNumber);
        setIsMember(isMemberStatus);
        console.log(`Membership status for group ${groupId}:`, isMemberStatus);
    }, [groups, groupId, userId]);

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const handleToggleMembership = async () => {
        try {
            if (isMember) {
                await deleteObject(`/groups/${groupId}/leave/`);
                updateGroups(groupId, "remove", userId);
                setSnackbarMessage("Sad to see you go");
                setIsMember(false);
            } else {
                const response = await createObject(`/groups/${groupId}/join/`, {});
                // Check if the response contains the member data before trying to use it
                if (response.data && response.data.member) {
                    updateGroups(groupId, "add", response.data.member);
                    setSnackbarMessage("Welcome to the group!");
                    setIsMember(true);
                } else {
                    // Handle cases where member data is not found in the response
                    console.error("Unexpected response structure:", response);
                    setSnackbarMessage("Joined the group, but member details are unavailable.");
                    setIsMember(true); // Assuming the join was successful even if member data isn't returned
                }
            }
            setOpenSnackbar(true);
        } catch (error) {
            let errorMessage = "Failed to update membership";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        }
    };



    return (
        <>
            <Stack direction="row">
                <IconButton aria-label="Group Button" onClick={handleToggleMembership} sx={{ margin: "0px", padding: "0px" }} >
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
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            />
        </>
    );
};
