/*
 * Data Type: boolean
 */

const builder = require('./helpers/builder');

const validator = (value) => {
  return typeof value === 'boolean';
};

module.exports = builder(validator);
