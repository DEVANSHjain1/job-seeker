const mongoose = require('mongoose');

// Payment Schema
const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  plan: {
    type: String,
    enum: ['basic', 'premium'],
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });

// Method to mark payment as completed
paymentSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
};

// Method to mark payment as failed
paymentSchema.methods.markAsFailed = function() {
  this.status = 'failed';
};

// Method to mark payment as refunded
paymentSchema.methods.markAsRefunded = function() {
  this.status = 'refunded';
};

// Static method to get subscription plan details
paymentSchema.statics.getPlanDetails = function(plan) {
  const plans = {
    basic: {
      credits: 100,
      amount: 300,
      currency: 'INR'
    },
    premium: {
      credits: 300,
      amount: 800,
      currency: 'INR'
    }
  };
  return plans[plan] || null;
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 