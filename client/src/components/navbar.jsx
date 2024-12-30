import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side: Logo and Company Name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo */}
          <img
            src="src\assets\react.svg"  // Replace with your logo path
            alt="Company Logo"
            style={{ width: '40px', marginRight: '10px' }}
          />
          {/* Company Name */}
          <Typography variant="h6" component="div">
            Cab Rental Company
          </Typography>
        </Box>

        {/* Right Side: Profile Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Profile Avatar (could be a clickable component for user settings) */}
          <Avatar 
            alt="Admin Profile"
            src="src\images\rsagarphoto.jpg"  // Replace with profile image
            sx={{ width: 40, height: 40, cursor: 'pointer' }} // Custom size and hover effect
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
