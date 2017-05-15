/*
 * Data Type: style
 */

const builder = require('./helpers/builder');

const validator = (value) => {
  return typeof value === 'object';
};

module.exports = builder(validator);
