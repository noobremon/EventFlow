const RSVP = require('../models/RSVP');
const Event = require('../models/Event');
const emailService = require('./emailService');
const config = require('../config/env');

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const sendEventReminders = async () => {
  try {
    const { start, end } = getTodayRange();

    const todaysEvents = await Event.find({
      status: 'published',
      dateTime: { $gte: start, $lte: end },
    });

    if (todaysEvents.length === 0) {
      return;
    }

    const eventIds = todaysEvents.map((event) => event._id);
    const attendees = await RSVP.find({
      event: { $in: eventIds },
      status: { $in: ['registered', 'approved'] },
      reminderSent: false,
    }).populate('event');

    for (const attendee of attendees) {
      if (!attendee.event || attendee.event.status !== 'published') {
        continue;
      }

      try {
        await emailService.sendEmail(attendee.email, 'eventReminder', {
          attendeeName: attendee.name,
          eventTitle: attendee.event.title,
          eventDate: attendee.event.dateTime,
          venue: attendee.event.isOnline ? 'Online' : attendee.event.venue,
        });

        attendee.reminderSent = true;
        await attendee.save();
      } catch (error) {
        console.error(`Failed to send reminder to ${attendee.email}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Failed to process event reminders:', error.message);
  }
};

const startReminderScheduler = () => {
  const intervalMinutes = parseInt(config.reminderCheckIntervalMinutes, 10) || 60;
  sendEventReminders();
  setInterval(sendEventReminders, intervalMinutes * 60 * 1000);
};

module.exports = {
  startReminderScheduler,
  sendEventReminders,
};
