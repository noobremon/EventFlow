const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const ApiError = require('../utils/apiError');
const generateSlug = require('../utils/generateSlug');
const emailService = require('./emailService');

/**
 * Create a new event for an organizer.
 */
const createEvent = async (organizerId, data) => {
  const slug = generateSlug(data.title);
  const event = await Event.create({
    ...data,
    organizer: organizerId,
    slug,
  });
  return event;
};

/**
 * Get all events for an organizer.
 */
const getOrganizerEvents = async (organizerId) => {
  return Event.find({ organizer: organizerId }).sort({ createdAt: -1 });
};

/**
 * Get a single event (owner only).
 */
const getEventById = async (eventId, organizerId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.organizer.toString() !== organizerId.toString()) {
    throw new ApiError(403, 'Not authorized to access this event');
  }
  return event;
};

/**
 * Update an event (owner only).
 * Notifies registered/approved/pending attendees when important fields change.
 */
const updateEvent = async (eventId, organizerId, data) => {
  const event = await getEventById(eventId, organizerId);

  // Don't allow editing cancelled events
  if (event.status === 'cancelled') {
    throw new ApiError(400, 'Cannot edit a cancelled event');
  }

  const allowedFields = [
    'title', 'description', 'dateTime', 'venue', 'isOnline',
    'onlineLink', 'capacity', 'registrationMode',
  ];

  // Track which user-visible fields actually changed
  const notifiableFields = {
    dateTime:         'Date/Time',
    venue:            'Venue',
    isOnline:         'Event format (online/in-person)',
    onlineLink:       'Online link',
    capacity:         'Capacity',
    registrationMode: 'Registration mode',
    title:            'Event title',
  };

  const changes = [];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      const oldVal = event[field];
      const newVal = data[field];

      // Compare as strings to handle dates / booleans cleanly
      if (String(oldVal) !== String(newVal) && notifiableFields[field]) {
        if (field === 'dateTime') {
          changes.push(
            `Date/Time changed to ${new Date(newVal).toLocaleString()}`
          );
        } else if (field === 'isOnline') {
          changes.push(newVal ? 'Event changed to Online' : 'Event changed to In-Person');
        } else if (field === 'capacity') {
          changes.push(`Capacity updated to ${newVal}`);
        } else if (field === 'registrationMode') {
          changes.push(`Registration mode changed to "${newVal}"`);
        } else if (field === 'venue') {
          changes.push(`Venue updated to: ${newVal}`);
        } else if (field === 'title') {
          changes.push(`Title updated to: ${newVal}`);
        } else if (field === 'onlineLink') {
          changes.push('Online link updated');
        }
      }

      event[field] = newVal;
    }
  });

  // Regenerate slug if title changed
  if (data.title) {
    event.slug = generateSlug(data.title);
  }

  await event.save();

  // Notify attendees only when user-visible fields changed
  if (changes.length > 0) {
    const attendees = await RSVP.find({
      event: eventId,
      status: { $in: ['registered', 'approved', 'pending'] },
    });

    for (const attendee of attendees) {
      await emailService.sendEmail(attendee.email, 'eventUpdated', {
        attendeeName: attendee.name,
        eventTitle: event.title,
        eventDate: event.dateTime,
        venue: event.isOnline ? 'Online' : event.venue,
        changes,
      });
    }
  }

  return event;
};

/**
 * Change event status (publish / cancel).
 */
const changeEventStatus = async (eventId, organizerId, newStatus) => {
  const event = await getEventById(eventId, organizerId);

  const validTransitions = {
    draft: ['published', 'cancelled'],
    published: ['cancelled'],
    cancelled: [],
  };

  if (!validTransitions[event.status].includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot change status from "${event.status}" to "${newStatus}"`
    );
  }

  event.status = newStatus;
  await event.save();

  // If event cancelled, notify all registered/approved attendees
  if (newStatus === 'cancelled') {
    const attendees = await RSVP.find({
      event: eventId,
      status: { $in: ['registered', 'approved', 'pending'] },
    });

    for (const attendee of attendees) {
      await emailService.sendEmail(attendee.email, 'eventCancelled', {
        attendeeName: attendee.name,
        eventTitle: event.title,
      });
    }
  }

  return event;
};

/**
 * Get a published event by slug (public access).
 */
const getPublicEvent = async (slug) => {
  const event = await Event.findOne({ slug, status: 'published' });
  if (!event) throw new ApiError(404, 'Event not found');

  // Determine registration status
  let registrationStatus = 'open';
  if (event.status === 'cancelled') {
    registrationStatus = 'cancelled';
  } else if (event.registeredCount >= event.capacity) {
    registrationStatus = 'full';
  } else if (new Date(event.dateTime) < new Date()) {
    registrationStatus = 'closed';
  }

  return { event, registrationStatus };
};

module.exports = {
  createEvent,
  getOrganizerEvents,
  getEventById,
  updateEvent,
  changeEventStatus,
  getPublicEvent,
};
