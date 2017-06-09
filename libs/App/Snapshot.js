const Joi = require('joi');

class Snapshot {
  constructor(initObject) {
    const schema = Joi.object({
      bundleId: Joi.string().required(),
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      shortDescription: Joi.string().required(),
      fullDescription: Joi.string().required(),
      keywords: Joi.string().required(),
      iconUrl: Joi.string().required(),
      website: Joi.string().optional(),
      contentRating: Joi.string().required(),
      packagedConfig: Joi.object().required(),
    });

    Joi.assert(initObject, schema);

    Object.assign(this, initObject);
  }
}

module.exports = Snapshot;
