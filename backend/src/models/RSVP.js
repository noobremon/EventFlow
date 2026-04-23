const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Attendee name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Attendee email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['pending', 'registered', 'approved', 'rejected', 'revoked'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// One registration per email per event
rsvpSchema.index({ event: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema);
