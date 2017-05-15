/*
 * Data Type: url
 */

const builder = require('./helpers/builder');

const validator = (value) => {
  const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  return urlRegex.test(value);
};

module.exports = builder(validator);
