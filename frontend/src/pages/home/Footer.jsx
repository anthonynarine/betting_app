import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50, // Adjust the height as needed
      backgroundColor: '#0A0A0A', // Or any color that fits your theme
      color: '#fff',
      mt: 'auto', // This helps push the footer to the bottom
    }}>
      <Typography variant="body1">
        © Betting App
      </Typography>
    </Box>
  );
};

export default Footer;
