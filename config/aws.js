/*
 * Core
 */

module.exports.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
module.exports.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
module.exports.region = process.env.REGION;

/*
 * S3
 */

module.exports.s3AppsBucket = process.env.S3_APPS_BUCKET;
module.exports.s3UsersBucket = process.env.S3_USERS_BUCKET;

/*
 * SQS
 */

module.exports.sqsAndroidAppDeploymentQueue = process.env.SQS_ANDROID_APP_DEPLOYMENT_QUEUE_URL;
module.exports.sqsIosAppDeploymentQueue = process.env.SQS_IOS_APP_DEPLOYMENT_QUEUE_URL;
