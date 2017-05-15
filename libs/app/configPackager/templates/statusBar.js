const ConfigPackager = require('../configPackger');

module.exports = {
  barStyle: ConfigPackager.STRING.REQUIRED('default'),
  hidden: ConfigPackager.BOOLEAN.REQUIRED(false),
};
