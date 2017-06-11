const Joi = require('joi');

class Snapshot {
  static get DEPLOYMENT_TYPES() {
    return {
      HARD: 'hard',
      SOFT: 'soft',
    };
  };

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

  requiresHardDeploy(previousSnapshot) {
    for (let key in this) {
      if (this[key] != previousSnapshot[key] && typeof this[key] != 'object') {
        return true;
      }
    }

    return false;
  }

  requiresSoftDeploy(previousSnapshot) {
    const recurse = (snapshotObject, previousSnapshotObject) => {
      for (let key in snapshotObject) {
        if (typeof snapshotObject[key] === 'object') {
          if (typeof previousSnapshotObject[key] !== 'object') {
            return true;
          }

          if (recurse(snapshotObject[key], previousSnapshotObject[key])) {
            return true;
          }
        } else if (snapshotObject[key] != previousSnapshotObject[key]) {
          return true;
        }
      }

      return false;
    };

    return recurse(this, previousSnapshot);
  }

  softDeploy() {
    // TODO: upload to s3
  }

  hardDeploy(){
    // TODO: offload to queue
  }
}

module.exports = Snapshot;
