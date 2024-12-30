import React from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const AssignedRequestTile = ({ request, onEndRide }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* Ride Details */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="textPrimary">
          Assigned Ride - {request.rideId}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => onEndRide(request.rideId)}
        >
          End Ride
        </Button>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Timeline */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: '1rem' }}>
        {/* Timeline Icons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: '1rem',
          }}
        >
          <FiberManualRecordIcon sx={{ fontSize: '1.2rem', color: 'green' }} />
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'gray', width: '2px', height: '1rem' }} />
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'gray', width: '2px', height: '1rem' }} />
          <LocationOnIcon sx={{ fontSize: '1.2rem', color: 'red' }} />
        </Box>

        {/* Pickup and Drop Locations */}
        <Box>
          <Typography variant="body1" color="textSecondary">
            Pickup: {request.pickupLocation}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Drop: {request.dropLocation}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AssignedRequestTile;
