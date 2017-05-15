/*
 * Data Type: icon
 */

const builder = require('./helpers/builder');

const availableIcons = {

};

const validator = (value) => {
  return value && value.set && value.name;
};

module.exports = builder(validator);
