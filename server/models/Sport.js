const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide sport name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Sport name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Please specify sport category'],
      enum: ['Outdoor', 'Indoor', 'Aquatic', 'Fitness', 'Racket'],
      default: 'Outdoor'
    },
    description: {
      type: String,
      required: [true, 'Please provide sport description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    image: {
      type: String,
      required: [true, 'Please provide sport banner image URL']
    },
    price: {
      type: Number,
      required: [true, 'Please provide booking price per slot'],
      min: [0, 'Price cannot be negative']
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify slot capacity'],
      min: [1, 'Capacity must be at least 1']
    },
    facilities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
      }
    ],
    coaches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach'
      }
    ],
    rules: [
      {
        type: String,
        trim: true
      }
    ],
    amenities: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Sport', sportSchema);
