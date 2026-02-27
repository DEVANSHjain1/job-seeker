const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.linkedinId;
    },
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  googleId: {
    type: String,
    sparse: true
  },
  linkedinId: {
    type: String,
    sparse: true
  },
  credits: {
    type: Number,
    default: 2 // Free credits for new users
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to check if user has sufficient credits
userSchema.methods.hasSufficientCredits = function() {
  return this.credits > 0;
};

// Method to deduct credits
userSchema.methods.deductCredits = function(amount = 1) {
  if (this.credits >= amount) {
    this.credits -= amount;
    return true;
  }
  return false;
};

// Method to add credits
userSchema.methods.addCredits = function(amount) {
  this.credits += amount;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 