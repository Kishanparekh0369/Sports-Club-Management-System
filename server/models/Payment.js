const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentReference: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    date: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card (Demo)', 'Debit Card (Demo)', 'UPI / QR (Demo)', 'Net Banking (Demo)'],
      default: 'Credit Card (Demo)'
    },
    type: {
      type: String,
      enum: ['membership', 'event', 'booking'],
      required: true
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    description: {
      type: String,
      default: 'Payment transaction'
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'refunded'],
      default: 'completed'
    },
    isDemo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
