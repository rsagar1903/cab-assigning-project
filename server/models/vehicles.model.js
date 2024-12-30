import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'assigned'],
    default: 'available'
}
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
