const mongoose = require('mongoose');

// Job Application Schema
const jobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  jobDescription: {
    type: String,
    trim: true
  },
  resumeUrl: {
    type: String,
    trim: true
  },
  additionalDetails: {
    type: String,
    trim: true
  },
  generatedEmail: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'archived'],
    default: 'draft'
  },
  sentAt: Date,
  airtableRecordId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
jobApplicationSchema.index({ user: 1, createdAt: -1 });
jobApplicationSchema.index({ companyName: 1 });
jobApplicationSchema.index({ jobTitle: 1 });

// Method to mark email as sent
jobApplicationSchema.methods.markAsSent = function() {
  this.status = 'sent';
  this.sentAt = new Date();
};

// Method to archive application
jobApplicationSchema.methods.archive = function() {
  this.status = 'archived';
};

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication; 