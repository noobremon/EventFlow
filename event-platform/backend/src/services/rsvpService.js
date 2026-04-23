const RSVP = require('../models/RSVP');
const Event = require('../models/Event');
const ApiError = require('../utils/apiError');
const emailService = require('./emailService');

/**
 * Register for an event (public).
 */
const register = async (slug, { name, email }) => {
  const event = await Event.findOne({ slug });
  if (!event) throw new ApiError(404, 'Event not found');

  // Check event is published
  if (event.status !== 'published') {
    throw new ApiError(400, 'This event is not accepting registrations');
  }

  // Check event hasn't passed
  if (new Date(event.dateTime) < new Date()) {
    throw new ApiError(400, 'This event has already passed');
  }

  // Check capacity
  if (event.registeredCount >= event.capacity) {
    throw new ApiError(400, 'This event is full');
  }

  // Check if already registered
  const existing = await RSVP.findOne({ event: event._id, email });
  if (existing) {
    throw new ApiError(409, 'You have already registered for this event');
  }

  // Determine initial status based on registration mode
  const status = event.registrationMode === 'open' ? 'registered' : 'pending';

  const rsvp = await RSVP.create({
    event: event._id,
    name,
    email,
    status,
  });

  // Increment registered count only for open mode (directly registered)
  if (status === 'registered') {
    event.registeredCount += 1;
    await event.save();
  }

  // Send confirmation email
  const emailType = status === 'registered' ? 'registrationConfirmed' : 'registrationPending';
  await emailService.sendEmail(email, emailType, {
    attendeeName: name,
    eventTitle: event.title,
    eventDate: event.dateTime,
    venue: event.isOnline ? 'Online' : event.venue,
  });

  return rsvp;
};

/**
 * Get all attendees for an event (organizer only).
 */
const getEventAttendees = async (eventId, organizerId, query = {}) => {
  // Verify ownership
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.organizer.toString() !== organizerId.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  const filter = { event: eventId };

  // Filter by status
  if (query.status) {
    filter.status = query.status;
  }

  // Search by name or email
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const attendees = await RSVP.find(filter).sort({ createdAt: -1 });
  return { attendees, event };
};

/**
 * Change RSVP status (approve / reject / revoke) — organizer only.
 */
const changeRSVPStatus = async (rsvpId, organizerId, newStatus) => {
  const rsvp = await RSVP.findById(rsvpId).populate('event');
  if (!rsvp) throw new ApiError(404, 'RSVP not found');

  const event = rsvp.event;
  if (event.organizer.toString() !== organizerId.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  // Validate status transitions
  const validTransitions = {
    pending: ['approved', 'rejected'],
    registered: ['revoked'],
    approved: ['revoked'],
    rejected: ['approved'],
    revoked: [],
  };

  if (!validTransitions[rsvp.status].includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot change RSVP status from "${rsvp.status}" to "${newStatus}"`
    );
  }

  const previousStatus = rsvp.status;
  rsvp.status = newStatus;
  await rsvp.save();

  // Update registered count
  const eventDoc = await Event.findById(event._id);

  if (newStatus === 'approved' && previousStatus !== 'approved') {
    // Check capacity before approving
    if (eventDoc.registeredCount >= eventDoc.capacity) {
      // Revert
      rsvp.status = previousStatus;
      await rsvp.save();
      throw new ApiError(400, 'Event is at full capacity, cannot approve');
    }
    eventDoc.registeredCount += 1;
    await eventDoc.save();
  }

  if (newStatus === 'revoked' && ['registered', 'approved'].includes(previousStatus)) {
    eventDoc.registeredCount = Math.max(0, eventDoc.registeredCount - 1);
    await eventDoc.save();
  }

  // Send email notification
  const emailTypeMap = {
    approved: 'rsvpApproved',
    rejected: 'rsvpRejected',
    revoked:  'rsvpRevoked',
  };

  if (emailTypeMap[newStatus]) {
    await emailService.sendEmail(rsvp.email, emailTypeMap[newStatus], {
      attendeeName: rsvp.name,
      eventTitle:   event.title,
      // Include event details for the approved email
      eventDate:    event.dateTime,
      venue:        event.isOnline ? 'Online' : event.venue,
    });
  }

  return rsvp;
};

module.exports = { register, getEventAttendees, changeRSVPStatus };
