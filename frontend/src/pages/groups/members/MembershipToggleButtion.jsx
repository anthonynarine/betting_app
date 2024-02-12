import React, { useState, useEffect } from "react"
import { IconButton, Snackbar, Grow, Icon } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useGroupData } from '../../../context/groupData/GroupDataProvider';
import useCrud from '../../../services/useCrud';
import { create } from "@mui/material/styles/createTransitions";



export const MembershipToggleButtion = ({ groupId }) => {
    const [isMember, setIsMember] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const { groups, userId, updateGroups } = useGroupData();
    const { createObject, deleteObject } = useCrud();

    useEffect(() => {
        // Determine if the current user is a member of this group
        const group = groups.find(group => group.id === groupId)
        const member = group?.members.find(member => member.userId === userId);
        setIsMember(!!member);
    }, [groups, groupId, userId]);

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const handleToggleMembership = async () => {
        try {
            if (isMember) {
                //Leave group logic
                await deleteObject(`/groups/${groupId}/leave/`)
                updateGroups(groupId, "remove", userId);
                setOpenSnackbar("Sad to see you go")
            } else {
                // Join group logic
                const newMemberData = await createObject(`/groups/${groupId}/join/`, {});
                updateGroups(groupId, "add", newMemberData)
                snackbarMessage("Welcome")
            }
            setOpenSnackbar(true);    
        } catch (error) {
            let errorMessage = "Failed to update membershitp";
            // This extracts the error message set up on the django view
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = errorMessage
        }
        setSnackbarMessage(errorMessage)
        setOpenSnackbar(true);
    }
};

return (
    <>
        <IconButton aria-label={isMember ? "leave group" : "join group"} onClick={handleToggleMembership}>
            {isMember ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineOutlinedIcon />}
        </IconButton>
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
)

};