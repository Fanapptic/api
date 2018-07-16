const aws = require('aws-sdk');
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
  appUserId: {
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
  gcmSnsArn: {
    type: Sequelize.STRING,
  },
  gcmRegistrationId: {
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

  return database.models.app.find({ where: { id: instance.appId } }).then(app => {
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
  this.appUserId = appDeviceSession.appUserId;
  this.location = appDeviceSession.location;

  return this.save();
};

AppDeviceModel.prototype.sendPushNotification = function(appNotification) {
  const sns = new aws.SNS();

  if (this.apnsSnsArn) {
    sns.publish({
      Message: JSON.stringify({
        default: appNotification.message,
        APNS: JSON.stringify({
          aps: {
            alert: {
              title: appNotification.title,
              body: appNotification.message,
            },
            badge: 1,
            sound: 'default',
          },
          id: appNotification.id,
          url: appNotification.url,
        }),
        APNS_SANDBOX: JSON.stringify({
          aps: {
            alert: {
              title: appNotification.title,
              body: appNotification.message,
            },
            badge: 1,
            sound: 'default',
          },
          id: appNotification.id,
          url: appNotification.url,
        }),
      }),
      TargetArn: this.apnsSnsArn,
      MessageStructure: 'json',
    }).promise().catch(err => console.log(err));
  }

  if (this.gcmSnsArn) {
    sns.publish({
      Message: JSON.stringify({
        default: appNotification.message,
        GCM: JSON.stringify({
          data: {
            message: appNotification.message,
            data: {
              id: appNotification.id,
            },
          },
        }),
      }),
      TargetArn: this.gcmSnsArn,
      MessageStructure: 'json',
    }).promise().catch(err => console.log(err));
  }
};

/*
 * Export
 */

module.exports = AppDeviceModel;
