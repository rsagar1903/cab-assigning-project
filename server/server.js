import express from "express";
import dotenv, { config, configDotenv } from "dotenv";
import mongoose, { connect } from "mongoose";
import { connectDB } from "./config/db.js";
import Users from "./models/users.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import Driver from "./models/drivers.model.js";
import Vehicle from "./models/vehicles.model.js";
import UpcomingRide from "./models/requests.model.js";
import router from "./routes/routes.js";
import Ride from "./models/rides.model.js";

const app = express();

dotenv.config();

app.use('/api', router);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is ready");
})

console.log(process.env.MONGO_URI)

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const user = await Users.findOne({ username });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }

});

app.put("/api/drivers", async (req, res) => {
  const driver = req.body;

  if (!driver.driverId || !driver.name || !driver.phoneNumber || !driver.status) {
    return res.status(400).json({ success: "false", message: "Pls provide all fields" });
  }

  const newDriver = new Driver(driver);
  try {
    await newDriver.save();
    res.status(201).json({ success: "true", message: newDriver })
  } catch (error) {
    res.status(500).json({ success: "false", message: "server error" })
  }
});


app.put("/api/vehicles", async (req, res) => {
  const vehicle = req.body;

  if (!vehicle.vehicleId || !vehicle.registrationNumber) {
    return res.status(400).json({ success: "false", message: "Pls provide all fields" });
  }

  const newVehicle = new Vehicle(vehicle);
  try {
    await newVehicle.save();
    res.status(201).json({ success: "true", message: newVehicle })
  } catch (error) {
    res.status(500).json({ success: "false", message: "server error" })
  }
});


app.put("/api/upcoming", async (req, res) => {
  const request = req.body;

  if (!request.pickupLocation || !request.dropLocation || !request.rideDate || !request.pickupTime) {
    return res.status(400).json({ success: "false", message: "Pls provide all fields" });
  }

  const newRequest = new UpcomingRide(request);
  try {
    await newRequest.save();
    res.status(201).json({ success: "true", message: newRequest })
  } catch (error) {
    res.status(500).json({ success: "false", message: error })
  }
});

app.get('/api/rides/upcoming', async (req, res) => {
  try {
    const unassignedRides = await UpcomingRide.find({ rideStatus: 'unassigned' });
    res.json({ success: true, rides: unassignedRides });
  } catch (error) {
    console.error('Error fetching unassigned rides:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/drivers/available', async (req, res) => {
  try {
    const drivers = await Driver.find({ status: 'available' });
    res.json({ drivers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching available drivers' });
  }
});

app.get('/api/vehicles/available', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: 'available' });
    res.json({ vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching available vehicles' });
  }
});


app.put('/api/assign-ride/:rideId', async (req, res) => {
  const { rideId } = req.params;
  const { driverId, vehicleId } = req.body;
  console.log(rideId, driverId, vehicleId);
  console.log("This route was accessed ");
  try {
    // Find the ride request using rideId
    const rideRequest = await UpcomingRide.findOne({ rideId });
    if (!rideRequest) {
      return res.status(404).json({ success: false, message: 'Ride request not found' });
    }
    console.log(rideRequest);

    // Find driver and vehicle
    const driver = await Driver.findOne({ _id: driverId });
    const vehicle = await Vehicle.findOne({ _id: vehicleId });
    console.log(driver, vehicle);

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Create a new Ride with all details from the ride request
    const assignedRide = new Ride({
      rideId: rideRequest.rideId,
      pickupLocation: rideRequest.pickupLocation,
      dropLocation: rideRequest.dropLocation,
      rideDate: rideRequest.rideDate,
      pickupTime: rideRequest.pickupTime,
      orgPhone: rideRequest.orgPhone,
      orgEmail: rideRequest.orgEmail,
      driverId: driverId, // Use driverId and vehicleId directly
      vehicleId: vehicleId,
      rideStatus: 'in progress',
    });
    console.log(assignedRide);

    // Save the ride
    await assignedRide.save();

    // Update ride request status
    try {
      await UpcomingRide.findOneAndUpdate({ rideId }, { rideStatus: 'assigned' });
      await Driver.findOneAndUpdate({ _id: driverId }, { status: 'assigned' });
      await Vehicle.findOneAndUpdate({ _id: vehicleId }, { status: 'assigned' });
    } catch (error) {
      console.log(error)
    }


    res.status(200).json({
      success: true,
      message: 'Ride assigned successfully',
      assignedRide,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/assignedRides', async (req, res) => {
  try {

    const assignedRides = await Ride.find({ rideStatus: 'in progress' });
    res.json({ assignedRides });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error in finding assigned rides' });
  }
});

app.put('/api/end-ride/:rideId', async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findOne({ rideId });
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride Not found' });
    }

    ride.rideStatus = 'completed';
    await ride.save();

    await Driver.findOneAndUpdate({ _id: ride.driverId }, { status: 'available' });
    await Vehicle.findOneAndUpdate({ _id: ride.vehicleId }, { status: 'available' });

    res.status(200).json({ success: true, message: "Ride successfully completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "could not end ride with following error : " + error });
  }
});

app.get('/api/rides/completed', async (req, res) => {
  try {
    const CompletedRides = await Ride.find({ rideStatus: 'completed' });
    res.json({ CompletedRides });
  } catch (error) {
    console.error(`Coudnt find Rides ${error}`);
    res.status(500).json({success:false , message:'Error in finding Rides'});
  }
});


app.listen(5000, () => {
  connectDB();
  console.log(`server started at http://localhost:5000`);
})

