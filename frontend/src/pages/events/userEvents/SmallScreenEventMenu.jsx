import React, { useState } from 'react';
import { Modal, Box, MenuItem, IconButton, useTheme } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%', // Adjust width to take up 3/4 of the screen
  height: 'auto', // Adjust height based on content or set a specific height
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4, // Padding inside the modal
  overflow: 'auto', // Ensure content is scrollable if it exceeds the modal height
};

const SmallScreenEventMenuModal = ({ onUpdate, onDelete }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <AddCircleOutlineOutlinedIcon sx={{ color: theme.palette.secondary.dark}} />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MenuItem onClick={() => { handleClose(); onUpdate(); }}>Update</MenuItem>
          <MenuItem onClick={() => { handleClose(); onDelete(); }}>Delete</MenuItem>
        </Box>
      </Modal>
    </>
  );
};

export default SmallScreenEventMenuModal;
