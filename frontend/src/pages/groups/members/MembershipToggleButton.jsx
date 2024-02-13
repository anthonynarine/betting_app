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

    const { groups, userId, updateGroups } = useGroupData();
    const { createObject, deleteObject } = useCrud();

    useEffect(() => {
        console.log("Effect running: Checking membership status...");
        const group = groups.find(group => group.id === groupId);
        const memberStatus = group?.members.some(member => member.userId === userId);
        console.log(`Membership status for group ${groupId}:`, memberStatus);
        setIsMember(memberStatus);
    }, [groups, groupId, userId]);

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const handleToggleMembership = async () => {
        try {
            if (isMember) {
                await deleteObject(`/groups/${groupId}/leave/`);
                updateGroups(groupId, "remove", userId);
                setSnackbarMessage("Sad to see you go");
            } else {
                const newMemberData = await createObject(`/groups/${groupId}/join/`, {});
                updateGroups(groupId, "add", newMemberData);
                setSnackbarMessage("Welcome to the group!");
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
                autoHideDuration={6000}
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
