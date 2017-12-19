const aws = require('aws-sdk');
const awsConfig = rootRequire('/config/aws');
const appConfig = rootRequire('/config/app');
const Snapshot = rootRequire('/libs/App/Snapshot');
const types = ['hard', 'soft'];
const statuses = ['pending', 'complete', 'failed'];

/*
 * Model Definition
 */

const AppDeploymentModel = database.define('appDeployments', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  version: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: appConfig.version,
  },
  type: {
    type: Sequelize.ENUM(...types),
    validate: {
      isIn: {
        args: [types],
        msg: 'The type provided is invalid.',
      },
    },
  },
  status: {
    type: Sequelize.ENUM(...statuses),
    validate: {
      isIn: {
        args: [statuses],
        msg: 'The status provided is invalid.',
      },
    },
    defaultValue: 'pending',
  },
  snapshot: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        if (!(value instanceof Snapshot)) {
          throw new Error('snapshot must be an instance of Snapshot.');
        }

        return true;
      },
    },
  },
  deployedAt: {
    type: Sequelize.DATE,
  },
});

/*
 * Instance Methods / Overrides
 */

AppDeploymentModel.prototype.hardDeploy = function() {
  const sqs = new aws.SQS();

  let promises = [];

  promises.push(sqs.sendMessage({
    MessageBody: JSON.stringify(this),
    MessageGroupId: 'deploy',
    QueueUrl: awsConfig.sqsAndroidAppDeploymentQueue,
  }).promise());

  promises.push(sqs.sendMessage({
    MessageBody: JSON.stringify(this),
    MessageGroupId: 'deploy',
    QueueUrl: awsConfig.sqsIosAppDeploymentQueue,
  }).promise());

  return Promise.all(promises);
};

AppDeploymentModel.prototype.softDeploy = function() {
  const s3 = new aws.S3();

  return s3.upload({
    ACL: 'public-read',
    Body: JSON.stringify(this.snapshot.packagedConfig),
    Bucket: awsConfig.s3AppsBucket,
    ContentType: 'application/json',
    Key: `${this.snapshot.bundleId}/runtimeConfig.json`,
  }).promise();
};

/*
 * Export
 */

module.exports = AppDeploymentModel;
