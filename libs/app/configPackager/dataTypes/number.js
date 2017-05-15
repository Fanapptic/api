/*
 * Data Type: number
 */

const builder = require('./helpers/builder');

const validator = (value) => {
  return !isNaN(value);
};

module.exports = builder(validator);
