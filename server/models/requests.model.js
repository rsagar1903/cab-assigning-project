import mongoose from 'mongoose';

const generateRideId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rideId = '';
    for (let i = 0; i < 8; i++) {
        rideId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return rideId;
};

const UpcomingRideSchema = new mongoose.Schema({
    rideId: {
        type: String,
        unique: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    dropLocation: {
        type: String,
        required: true
    },
    rideDate: {
        type: Date,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    orgPhone: {
        type: String,
        required: true
    },
    orgEmail: {
        type: String,
        required: true
    },
    rideStatus: {
        type: String,
        enum: ['unassigned', 'assigned'],
        default: 'unassigned'
    }
}, { timestamps: true });

UpcomingRideSchema.pre('save', function (next) {
    if (!this.rideId) {
        this.rideId = generateRideId();
    }
    next();
});

const UpcomingRide = mongoose.model('UpcomingRide', UpcomingRideSchema);

export default UpcomingRide;
