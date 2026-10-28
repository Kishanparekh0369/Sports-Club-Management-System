const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide plan name'],
      trim: true,
      unique: true
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Ideal for sports enthusiasts'
    },
    durationMonths: {
      type: Number,
      required: [true, 'Please provide duration in months'],
      min: [1, 'Duration must be at least 1 month']
    },
    price: {
      type: Number,
      required: [true, 'Please specify plan price'],
      min: [0, 'Price cannot be negative']
    },
    benefits: [
      {
        type: String,
        trim: true,
        required: true
      }
    ],
    badge: {
      type: String,
      default: ''
    },
    isPopular: {
      type: Boolean,
      default: false
    },
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

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
