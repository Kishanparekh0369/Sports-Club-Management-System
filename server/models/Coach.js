const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide coach name'],
      trim: true,
      maxlength: [100, 'Coach name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide coach email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide coach phone number'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Please specify coach specialization'],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, 'Please specify years of experience'],
      min: [0, 'Experience cannot be negative']
    },
    bio: {
      type: String,
      required: [true, 'Please provide a coach bio'],
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    photo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    sports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport'
      }
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    certifications: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Coach', coachSchema);
