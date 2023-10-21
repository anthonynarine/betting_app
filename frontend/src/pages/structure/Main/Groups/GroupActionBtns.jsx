import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import Snackbar from "@mui/material/Snackbar";
import useAxiosWithInterceptor from "../../../../services/jwtinterceptor";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CustomIconButton = styled(IconButton)`
  background-color: #000;
  color: #fff;
  &:hover {
    background-color: #000;
  }
`;

const LeaveIconButton = styled(IconButton)`
  background-color: #ff0000;
  color: #fff;
  &:hover {
    background-color: #cc0000;
  }
`;

export const JoinGroupButton = ({ groupId }) => {
  const jwtAxios = useAxiosWithInterceptor();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
  };

  const handleJoinGroup = async () => {
    try {
      const response = await jwtAxios.post(`${BASE_URL}/groups/${groupId}/join/`);
      if (response.status === 200) {
        setOpen(true);
      }
    } catch (error) {
      console.error("Failed to join group:", error);
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Tooltip title="Join Group" arrow>
        <CustomIconButton aria-label="join-group" onClick={handleJoinGroup}>
          <GroupAddIcon />
        </CustomIconButton>
      </Tooltip>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Successfully joined the group"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Failed to join the group"
      />
    </>
  );
};

export const LeaveGroupButton = ({ groupId }) => {
  const jwtAxios = useAxiosWithInterceptor();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await jwtAxios.post(`${BASE_URL}/groups/${groupId}/leave/`);
      if (response.status === 200) {
        setOpen(true);
      }
    } catch (error) {
      console.error("Failed:", error);
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Tooltip title="Leave Group" arrow>
        <LeaveIconButton onClick={handleLeaveGroup}>
          <GroupRemoveIcon />
        </LeaveIconButton>
      </Tooltip>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Successfully left the group"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Failed to leave the group"
      />
    </>
  );
};
