/*
 * Data Type: gradient
 */

const builder = require('./helpers/builder');
const colorValidator = require('./color').validator;
const numberValidator = require('./number').validator;

const validator = (value) => {
  const {
    colors,
    start,
    end,
    locations,
  } = value;

  if (!Array.isArray(colors)) {
    return false;
  }

  for (let i = 0; i < colors.length; i++) {
    if (!colorValidator(colors[i])) {
      return false;
    }
  }

  // start
  if (start && (!numberValidator(start.x) || !numberValidator(start.y))) {
    return false;
  }

  // end
  if (end && (!numberValidator(end.x) || !numberValidator(end.y))) {
    return false;
  }

  // locations
  if (Array.isArray(locations)) {
    if (locations.length !== colors.length) {
      return false;
    }

    for (let i = 0; i < locations.length; i++) {
      if (!numberValidator(locations[i])) {
        return false;
      }
    }
  }

  // success
  return true;
};

module.exports = builder(validator);
