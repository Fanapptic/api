const aws = require('aws-sdk');
const awsConfig = rootRequire('/config/aws');

// TODO: Do not hard code keys!!! Make a working config system that imports to env on dev launch or something.
aws.config = new aws.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAIRSXMTLENNWM3IIA',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
  region: awsConfig.region,
});
