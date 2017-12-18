const Joi = require('joi');
const _ = require('lodash');

class Snapshot {
  static get DEPLOYMENT_TYPES() {
    return {
      HARD: 'hard',
      SOFT: 'soft',
    };
  }

  constructor(initObject) {
    const schema = Joi.object({
      bundleId: Joi.string().required(),
//      appleTeamId: Joi.string().required(),
//      appleTeamName: Joi.string().required(),
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      subtitle: Joi.string().required(),
      description: Joi.string().required(),
      keywords: Joi.string().required(),
      icons: Joi.array().items(Joi.object({
        url: Joi.string().required(),
        name: Joi.string().required(),
        size: Joi.number().required(),
      })).allow(null).required(),
      website: Joi.string().optional(),
      contentRating: Joi.string().required(),
      packagedConfig: Joi.object().required(),
      launchConfig: Joi.object().required(),
    });

    Joi.assert(initObject, schema);

    Object.assign(this, initObject);
  }

  requiresHardDeploy(previousSnapshot) {
    for (let key in this) {
      if (this[key] != previousSnapshot[key] && typeof this[key] != 'object') {
        return true;
      }
    }

    return false;
  }

  requiresSoftDeploy(previousSnapshot) {
    // We have to stringify "this" and parse otherwise isEqual
    // will always return false since "this" is not a generic object.
    return !_.isEqual(JSON.parse(JSON.stringify(this)), previousSnapshot);
  }
}

module.exports = Snapshot;
