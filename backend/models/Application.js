const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['Applied', 'OA/Assessment', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  dateApplied: { type: Date, required: true }
});

module.exports = mongoose.model('Application', applicationSchema);