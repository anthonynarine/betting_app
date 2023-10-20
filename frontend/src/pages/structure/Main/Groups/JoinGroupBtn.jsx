import React from 'react';
import IconButton from '@mui/material/IconButton';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import useAxiosWithInterceptor from './path/to/useAxiosWithInterceptor';  

const CustomIconButton = styled(IconButton)`
  background-color: #000;  /* Black background */
  color: #fff;  /* White text */
  &:hover {
    background-color: #000;  /* Darker black on hover */
  }
`;

const JoinGroupButton = () => {

  const navigate = useNavigate();
  const jwtAxios = useAxiosWithInterceptor();

  const handleJoinGrop = async () => {
    try {
      const response = await
      
    } catch (error) {
      
    }
  }


  return (
    <Tooltip title="Join Group" arrow>
      <CustomIconButton aria-label="join-group">
        <GroupAddIcon />
      </CustomIconButton>
    </Tooltip>
  );
};

export default JoinGroupButton;
