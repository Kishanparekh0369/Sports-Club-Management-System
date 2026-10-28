const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide facility name'],
      trim: true,
      maxlength: [100, 'Facility name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide facility description'],
      trim: true
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
      default: null
    },
    sportName: {
      type: String,
      default: 'General'
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify facility capacity'],
      min: [1, 'Capacity must be at least 1']
    },
    courtNumber: {
      type: String,
      trim: true,
      default: 'Court 1'
    },
    openingHours: {
      start: {
        type: String,
        default: '06:00'
      },
      end: {
        type: String,
        default: '22:00'
      }
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'maintenance', 'reserved'],
      default: 'available'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Facility', facilitySchema);
