const Joi = require('joi');
const appConfig = rootRequire('/config/app');

class RuntimeConfig {
  constructor(initObject) {
    const runtimeConfig = Object.assign({}, appConfig.defaults.runtimeConfig, initObject);

    Joi.assert(runtimeConfig, Joi.object({
      css: Joi.object().required(),
    }));

    Object.assign(this, runtimeConfig);
  }
}

module.exports = RuntimeConfig;
