/*
 * Data Type: color
 */

const builder = require('./helpers/builder');

const validator = (value) => {
  const hexRegex = /^#[0-9a-f]{3,6}$/i;
  const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  const rgbaRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(0\.\d+))?\)$/;

  return hexRegex.test(value) || rgbRegex.test(value) || rgbaRegex.test(value);
};

module.exports = builder(validator);
