import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import useAxiosWithInterceptor from "../../../../services/jwtinterceptor";

const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log("TESTBASEURL", BASE_URL);

const CustomIconButton = styled(IconButton)`
  background-color: #000; /* Black background */
  color: #fff; /* White text */
  &:hover {
    background-color: #000; /* Darker black on hover */
  }
`;

const JoinGroupButton = ({ groupId }) => {
  const jwtAxios = useAxiosWithInterceptor();

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleJoinGrop = async () => {
    try {
      const response = await jwtAxios.post(`${BASE_URL}/groups/${groupId}/join/`);
      if (response.status === 200) {
        setOpen(true);
      }
    } catch (error) {
      console.error("Failed to join group:", error);
    }
  };

  return (
    <>
      <Tooltip title="Join Group" arrow>
        <CustomIconButton aria-label="join-group" onClick={handleJoinGrop}>
          <GroupAddIcon />
        </CustomIconButton>
      </Tooltip>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Successfully joined the group"
      />
    </>
  );
};

export default JoinGroupButton;
