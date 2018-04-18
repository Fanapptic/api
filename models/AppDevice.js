const aws = require('aws-sdk');
const AppModel = rootRequire('/models/App');
const platforms = ['android', 'ios'];

/*
 * Model Definition
 */

const AppDeviceModel = database.define('appDevice', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  accessToken: {
    type: Sequelize.UUID,
    unique: true,
    defaultValue: Sequelize.UUIDV1,
  },
  apnsToken: {
    type: Sequelize.STRING,
  },
  apnsSnsArn: {
    type: Sequelize.STRING,
  },
  gcmRegistrationId: {
    type: Sequelize.STRING,
  },
  gcmSnsArn: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.JSON,
  },
  deviceDetails: {
    type: Sequelize.JSON,
  },
  platform: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [platforms],
        msg: 'The platform provided is invalid.',
      },
    },
  },
});

/*
 * Instance Hooks
 */

AppDeviceModel.beforeCreate(setPlatformArn);
AppDeviceModel.beforeUpdate(setPlatformArn);

function setPlatformArn(instance) {
  if (!instance.apnsToken && !instance.gcmRegistrationId) {
    return;
  }

  return AppModel.find({ where: { id: instance.appId } }).then(app => {
    const sns = new aws.SNS();
    let snsPromises = [];

    if (app.apnsSnsArn && instance.apnsToken && instance.changed('apnsToken')) {
      snsPromises.push(sns.createPlatformEndpoint({
        Token: instance.apnsToken,
        PlatformApplicationArn: app.apnsSnsArn,
      }).promise().then(result => {
        instance.apnsSnsArn = result.EndpointArn;
      }));
    }

    if (app.gcmSnsArn && instance.gcmRegistrationId && instance.changed('gcmRegistrationId')) {
      snsPromises.push(sns.createPlatformEndpoint({
        Token: instance.gcmRegistrationId,
        PlatformApplicationArn: app.gcmSnsArn,
      }).promise().then(result => {
        instance.gcmSnsArn = result.EndpointArn;
      }));
    }

    return Promise.all(snsPromises);
  });
}

/*
 * Instance Methods / Overrides
 */

AppDeviceModel.prototype.syncToSession = function(appDeviceSession) {
  this.networkUserId = appDeviceSession.networkUserId;
  this.location = appDeviceSession.location;

  return this.save();
};

AppDeviceModel.prototype.sendPushNotification = function(appNotification) {
  if (!this.apnsSnsArn && !this.gcmSnsArn) {
    return;
  }

  const sns = new aws.SNS();

  if (this.apnsSnsArn) {
    sns.publish({
      Message: JSON.stringify({
        APNS: {
          aps: {
            alert: appNotification.content,
            notification: appNotification,
          },
        },
      }),
      TargetArn: this.apnsSnsArn,
      MessageStructure: 'json',
    }).promise().catch(err => console.log(err));
  }

  if (this.gcmSnsArn) {
    // TODO: Not sure what the correct usage of GCM params is to send notification &
    // data to the android apps..
/*    sns.publish({
      Message: JSON.stringify({
        GCM: {
          notification: {
            message: appNotification.content,
            notification: appNotification,
          },
        },
      }),
      TargetArn: this.gcmSnsArn,
      MessageStructure: 'json',
    });*/
  }
};

/*
 * Export
 */

module.exports = AppDeviceModel;
