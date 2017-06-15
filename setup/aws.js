const aws = require('aws-sdk');
const awsConfig = rootRequire('/config/aws');

aws.config.region = awsConfig.region;
