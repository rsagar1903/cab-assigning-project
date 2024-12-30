import e from "express";
import Driver from "../models/drivers.model.js";
import Vehicle from "../models/vehicles.model.js";
import Ride from "../models/rides.model.js";
import UpcomingRide from "../models/requests.model.js";


const router = e.Router();

// router.get('/rides/upcoming' , async (req , res)=>{
//     try {
//       const rides = await UpcomingRide.find({ rideStatus: 'unassigned' });
//       res.json({rides})
//     } catch (error) {
//       console.log(error);
//        res.status(500).json({message:error})
//     }
// }); 

// router.get('/drivers/available', async (req, res) => {
//     try {
//       const drivers = await Driver.find({ status: 'available' });
//       res.json({ drivers });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error while fetching available drivers' });
//     }
// });

// router.get('/vehicles/available', async (req, res) => {
//     try {
//       const vehicles = await Vehicle.find({ status: 'available' });
//       res.json({ vehicles });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error while fetching available vehicles' });
//     }
// });

// router.put('/rides/assign/:rideId', async (req, res) => {
//     const { rideId } = req.params;
//     const { driverId, vehicleId } = req.body;
  
//     try {
//       const ride = await Ride.findById(rideId);
//       if (!ride) {
//         return res.status(404).json({ message: 'Ride not found' });
//       }
  
//       const driver = await Driver.findById(driverId);
//       const vehicle = await Vehicle.findById(vehicleId);
  
//       if (!driver || !vehicle) {
//         return res.status(404).json({ message: 'Driver or vehicle not found' });
//       }
  
//       // Update the ride with assigned driver and vehicle
//       ride.driverId = driverId;
//       ride.vehicleId = vehicleId;
//       ride.rideStatus = 'in progress';
//       await ride.save();
  
//       // Update the driver and vehicle status
//       driver.status = 'assigned';
//       vehicle.status = 'assigned';
//       await driver.save();
//       await vehicle.save();
  
//       res.json({ message: 'Ride assigned successfully', ride });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error while assigning ride' });
//     }
// });

export default router;