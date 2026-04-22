const rsvpService = require('../services/rsvpService');

const register = async (req, res, next) => {
  try {
    const rsvp = await rsvpService.register(req.params.slug, req.body);
    res.status(201).json({ success: true, data: rsvp });
  } catch (error) {
    next(error);
  }
};

const getEventAttendees = async (req, res, next) => {
  try {
    const result = await rsvpService.getEventAttendees(
      req.params.eventId,
      req.user._id,
      req.query
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const changeRSVPStatus = async (req, res, next) => {
  try {
    const rsvp = await rsvpService.changeRSVPStatus(
      req.params.rsvpId,
      req.user._id,
      req.body.status
    );
    res.status(200).json({ success: true, data: rsvp });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, getEventAttendees, changeRSVPStatus };
