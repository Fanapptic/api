const Joi = require('joi');
const aws = require('aws-sdk');
const appConfig = rootRequire('/config/app');
const awsConfig = rootRequire('/config/aws');

class RuntimeConfig {
  constructor(initObject) {
    const runtimeConfig = Object.assign({}, appConfig.defaults.runtimeConfig, initObject);

    Joi.assert(runtimeConfig, Joi.object({
      publicId: Joi.string().allow(null),
      bundleId: Joi.string().allow(null),
      displayName: Joi.string().allow(null),
      css: Joi.object().required(),
    }));

    Object.assign(this, runtimeConfig);
  }

  uploadToS3(app) {
    const s3 = new aws.S3();

    return s3.upload({
      ACL: 'public-read',
      Body: JSON.stringify(this),
      Bucket: awsConfig.s3AppsBucket,
      ContentType: 'application/json',
      Key: `${app.bundleId}/runtimeConfig.json`,
    }).promise();
  }
}

module.exports = RuntimeConfig;
