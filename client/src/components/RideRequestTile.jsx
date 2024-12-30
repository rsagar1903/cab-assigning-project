import React, { useState } from 'react';
import { Paper, Typography, Button, Box, Collapse, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';

const RideRequestBar = ({ request, onAssign, onEndRide, isAssigned , drivers , vehicles }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedvehicle, setSelectedvehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [isRideAssigned, setRideAssigned] = useState(isAssigned);

  const handleAssignClick = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleVehicleChange = (event) => {
    setSelectedvehicle(event.target.value);
  };

  const handleDriverChange = (event) => {
    setSelectedDriver(event.target.value);
  };

  const assignRide = () => {
    if (selectedvehicle && selectedDriver) {
      setRideAssigned(true);
      console.log(selectedDriver , selectedvehicle);
      onAssign(selectedDriver, selectedvehicle); // Trigger with driverId and vehicleId
    }
  };
  

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Ride Request Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">{request.rideId}</Typography>
          <Typography variant="body1" fontWeight="bold">From : {request.pickupLocation}</Typography>
          <Typography variant="body1" fontWeight="bold">To : {request.dropLocation}</Typography>
          <Typography variant="body2" color="text.secondary">{request.rideDate}</Typography>
          <Typography variant="body2" color="text.secondary">Time: {request.pickupTime}</Typography>
          <Typography variant="body2" color="text.secondary">Organization email & Phone : <br /> {request.orgPhone} <br /> {request.orgEmail} </Typography>
        </Box>
        
        {/* Buttons */}
        {!isRideAssigned && (
          <Button variant="contained" color="primary" onClick={handleAssignClick}>
            Assign Ride
          </Button>
        )}
        {/* {isRideAssigned && (
          <Button variant="contained" color="success" onClick={onEndRide}>
            End Ride
          </Button>
        )} */}
      </Box>

      {/* Dropdown for Assign Ride */}
      <Collapse in={isDropdownOpen}>
        <Box sx={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
          {/* Column 1: Cab Search */}
          <Box sx={{ flex: 1 }}>
            <TextField label="Search Cab (Regn. No)" fullWidth />
            <RadioGroup value={selectedvehicle} onChange={handleVehicleChange}>
            {vehicles.map((vehicle) => (
                <FormControlLabel
                  key={vehicle._id}
                  value={vehicle._id}
                  control={<Radio />}
                  label={`${vehicle.registrationNumber}`}
                />
              ))}
            
            </RadioGroup>
          </Box>

          {/* Column 2: Driver Search */}
          <Box sx={{ flex: 1 }}>
            <TextField label="Search Driver" fullWidth />
            <RadioGroup value={selectedDriver} onChange={handleDriverChange}>
            {drivers.map((driver) => (
                <FormControlLabel
                  key={driver._id}
                  value={driver._id}
                  control={<Radio />}
                  label={`${driver.name}`}
                />
              ))}
            </RadioGroup>
          </Box>
        </Box>

        {/* Assign Ride Button */}
        <Box sx={{ marginTop: '1rem' }}>
          <Button variant="contained" color={selectedvehicle && selectedDriver ? 'success' : 'primary'} onClick={assignRide} disabled={!selectedvehicle || !selectedDriver}>
            {isRideAssigned ? 'Assigned' : 'Confirm Assignment'}
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default RideRequestBar;
