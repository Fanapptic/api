const aws = require('aws-sdk');
const awsConfig = rootRequire('/config/aws');
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
    defaultValue: '1.0.0',
  },
  build: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 1,
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

  return sqs.sendMessage({
    MessageBody: JSON.stringify(this),
    MessageGroupId: 'deploy',
    QueueUrl: awsConfig.sqsAppDeploymentsQueue,
  }).promise();
};

AppDeploymentModel.prototype.softDeploy = function() {
  const s3 = new aws.S3();

  return s3.upload({
    ACL: 'public-read',
    Body: JSON.stringify(this.snapshot.packagedConfig),
    Bucket: awsConfig.s3AppConfigsBucket,
    ContentType: 'application/json',
    Key: `${this.snapshot.bundleId}.json`,
  }).promise();
};

/*
 * Export
 */

module.exports = AppDeploymentModel;
