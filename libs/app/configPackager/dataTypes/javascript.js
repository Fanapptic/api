/*
 * Data Type: javascript
 */

const builder = require('./helpers/builder');

const stringValidator = require('./string').validator;

const validator = (value) => {
  return stringValidator(value);
};

module.exports = builder(validator);
