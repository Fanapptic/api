const Joi = require('joi');
const _ = require('lodash');
const aws = require('aws-sdk');
const awsConfig = rootRequire('/config/aws');

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
    // We have to stringify "this" and parse otherwise isEqual
    // will always return false since "this" is not a generic object.
    return !_.isEqual(JSON.parse(JSON.stringify(this)), previousSnapshot);
  }

  softDeploy() {
    const s3 = new aws.S3();

    return s3.upload({
      ACL: 'public-read',
      Body: JSON.stringify(this.packagedConfig),
      Bucket: awsConfig.s3AppConfigsBucket,
      ContentType: 'application/json',
      Key: `${this.bundleId}.json`,
    }).promise();
  }

  hardDeploy() {
    const sqs = new aws.SQS();

    let message = Object.assign({}, this);
    delete message.packagedConfig;

    return sqs.sendMessage({
      MessageBody: JSON.stringify(message),
      MessageGroupId: 'deploy',
      QueueUrl: awsConfig.sqsAppDeploymentsQueue,
    }).promise();
  }
}

module.exports = Snapshot;
