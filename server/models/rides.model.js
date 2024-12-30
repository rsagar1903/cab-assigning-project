import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  rideId: {
    type: String,
    required: true,
    unique: true,
    // Generate a random alphanumeric string for ride ID if not provided
    default: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
  },
  driverId: {
    type: mongoose.Schema.Types.String,
    ref: 'Driver',
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.String,
    ref: 'Vehicle',
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  rideDate: {
    type: Date,
    required: true,
  },
  pickupTime: {
    type: String, // Could also be Date if you want a specific time object
    required: true,
  },
  rideStatus: {
    type: String,
    enum: ['unassigned', 'in progress', 'completed'],
    default: 'unassigned',
  },
  orgPhone: {
    type: String,
    required: true,
  },
  orgEmail: {
    type: String,
    required: true,
  },
});

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;
