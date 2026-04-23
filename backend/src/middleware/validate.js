const ApiError = require('../utils/apiError');

/**
 * Simple request body validation middleware factory.
 * @param {string[]} requiredFields - Array of required field names.
 */
const validate = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return next(
        new ApiError(400, `Missing required fields: ${missing.join(', ')}`)
      );
    }

    next();
  };
};

module.exports = validate;
