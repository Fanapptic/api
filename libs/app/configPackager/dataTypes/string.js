/*
 * Data Type: string
 */

const builder = require('./helpers/builder');

const validator = (value) => {
  return typeof value === 'string';
};

module.exports = builder(validator);
