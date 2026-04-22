const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: 5000,
    },
    dateTime: {
      type: Date,
      required: [true, 'Event date/time is required'],
    },
    venue: {
      type: String,
      trim: true,
      default: '',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    onlineLink: {
      type: String,
      trim: true,
      default: '',
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    registrationMode: {
      type: String,
      enum: ['open', 'shortlisted'],
      default: 'open',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled'],
      default: 'draft',
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
