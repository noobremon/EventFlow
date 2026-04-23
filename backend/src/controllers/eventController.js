const eventService = require('../services/eventService');
const rsvpService = require('../services/rsvpService');
const { Parser } = require('json2csv');

const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.user._id, req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await eventService.getOrganizerEvents(req.user._id);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const changeEventStatus = async (req, res, next) => {
  try {
    const event = await eventService.changeEventStatus(
      req.params.id,
      req.user._id,
      req.body.status
    );
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const getPublicEvent = async (req, res, next) => {
  try {
    const result = await eventService.getPublicEvent(req.params.slug);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const exportEventCSV = async (req, res, next) => {
  try {
    // rsvpService handles ownership verification
    const { attendees } = await rsvpService.getEventAttendees(req.params.id, req.user._id);

    const csvData = attendees.map(a => ({
      name: a.name,
      email: a.email,
      status: a.status,
      registration_date: new Date(a.createdAt).toISOString().split('T')[0]
    }));

    const json2csvParser = new Parser({ fields: ['name', 'email', 'status', 'registration_date'] });
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('event-attendees.csv');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getOrganizerEvents,
  getEventById,
  updateEvent,
  changeEventStatus,
  getPublicEvent,
  exportEventCSV,
};
