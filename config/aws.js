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
module.exports.s3AppsContentBucket = process.env.S3_APPS_CONTENT_BUCKET;

/*
 * SQS
 */

module.exports.sqsAccountSetupQueue = process.env.SQS_ACCOUNT_SETUP_QUEUE_URL;
module.exports.sqsAndroidAppDeploymentQueue = process.env.SQS_ANDROID_APP_DEPLOYMENT_QUEUE_URL;
module.exports.sqsIosAppDeploymentQueue = process.env.SQS_IOS_APP_DEPLOYMENT_QUEUE_URL;
