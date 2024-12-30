import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, TextField, Paper, Radio, RadioGroup, FormControlLabel, Snackbar, Alert, Tab, Tabs } from '@mui/material';
import RideRequestBar from './RideRequestTile';
import AssignedRequestTile from './AssignedRequestTile';
import axios from 'axios';



const RideRequests = () => {
  const [tabIndex, setTabIndex] = useState(0); // State to manage selected tab
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rideResponse = await axios.get('http://localhost:5000/api/rides/upcoming');
        setIncomingRequests(rideResponse.data.rides);

        const driversResponse = await axios.get('http://localhost:5000/api/drivers/available');
        setAvailableDrivers(driversResponse.data.drivers);

        const vehiclesResponse = await axios.get('http://localhost:5000/api/vehicles/available');
        setAvailableVehicles(vehiclesResponse.data.vehicles);

        const assignedRidesResponse = await axios.get('http://localhost:5000/api/assignedRides')
        setAssignedRequests(assignedRidesResponse.data.assignedRides);

        const completedResponse = await axios.get('http://localhost:5000/api/rides/completed');
        setCompletedRequests(completedResponse.data.CompletedRides);
        // console.log(completedResponse.data.CompletedRides);
      } catch (error) {
        console.error('Error fetching data rides:', error);
      }
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleAssign = async (rideId, driverId, vehicleId) => {
    try {
      // Update ride status and assign driver/vehicle
      console.log(rideId, driverId, vehicleId);
      const inputData = { driverId, vehicleId };
      const res = await fetch(`http://localhost:5000/api/assign-ride/${rideId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
      if (!res.ok) {
        throw new Error(`Failed to assign ride. Status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Assign Response:', data);

      // Update the state to reflect the assignment
      setIncomingRequests(prevRequests => prevRequests.filter(req => req.id !== rideId));

      // Refresh assigned requests
      setAssignedRequests(prevRequests => [...prevRequests, { ...prevRequests.find(req => req.id === rideId), isAssigned: true }]);

      // Update driver and vehicle statuses
      setAvailableDrivers(prevDrivers => prevDrivers.filter(driver => driver._id !== driverId));
      setAvailableVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle._id !== vehicleId));
    } catch (error) {
      console.error('Error assigning ride:', error);
    }
  };

  const handleEndRide = async (rideId) => {

    try {
      const rideEndResponse = await fetch(`http://localhost:5000/api/end-ride/${rideId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!rideEndResponse.ok) {
        throw new Error(`Failed to End Ride ${rideEndResponse.status}`);
      }
      // Remove the ride from assigned requests
      setAssignedRequests((prevRequests) =>
        prevRequests.filter((req) => req.rideId !== rideId)
      );

      // Fetch updated drivers and vehicles (to reflect their availability)
      const driversResponse = await axios.get('http://localhost:5000/api/drivers/available');
      setAvailableDrivers(driversResponse.data.drivers);

      const vehiclesResponse = await axios.get('http://localhost:5000/api/vehicles/available');
      setAvailableVehicles(vehiclesResponse.data.vehicles);

      console.log(`Ride with ID ${rideId} marked as completed`);
      setNotification({
        open: true,
        message: `Ride with ID ${rideId} has been completed.`,
        severity: 'success',
      });
    } catch (error) {
      console.error(`Error ending the Ride ${error} with rideId ${rideId}`);
      setNotification({
        open: true,
        message: `Failed to complete ride with ID ${rideId}.`,
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Tabs Section */}
      <Paper sx={{ marginBottom: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Incoming Requests" />
          <Tab label="Assigned Requests" />
          <Tab label="Completed Rides" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {/* Incoming Requests Tab */}
        {tabIndex === 0 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Incoming Ride Requests
            </Typography>
            {incomingRequests.map(request => (
              <RideRequestBar
                key={request.rideId}
                request={request}
                onAssign={(driverId, vehicleId) => handleAssign(request.rideId, driverId, vehicleId)}
                drivers={availableDrivers}
                vehicles={availableVehicles}
              />
            ))}
          </Box>
        )}

        {/* Assigned Requests Tab */}
        {tabIndex === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Assigned Rides
            </Typography>
            {assignedRequests.map(request => (
              <AssignedRequestTile
                key={request.rideId}
                request={request}
                onEndRide={() => handleEndRide(request.rideId, request.driverId, request.vehicleId)}
              />
            ))}
          </Box>
        )}

        {/* Completed Rides Tab */}
        {tabIndex === 2 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Completed Rides
            </Typography>
            {completedRequests.map(request => (
              <Paper key={request.rideId} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="body1">
                  <strong>Ride ID:</strong> {request.rideId}
                </Typography>
                <Typography variant="body1">
                  <strong>Pickup Location:</strong> {request.pickupLocation}
                </Typography>
                <Typography variant="body1">
                  <strong>Drop Location:</strong> {request.dropLocation}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> Completed
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default RideRequests;
