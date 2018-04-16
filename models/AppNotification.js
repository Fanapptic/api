const AppDeviceModel = rootRequire('/models/AppDevice');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');

/*
 * Model Definition
 */

const AppNotificationModel = database.define('appNotification', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  appModuleId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  appDeviceId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  moduleRelativeUrl: {
    type: Sequelize.TEXT,
  },
  externalUrl: {
    type: Sequelize.TEXT,
  },
  parameters: {
    type: Sequelize.JSON,
  },
  previewImageUrl: {
    type: Sequelize.STRING,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  read: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

/*
 * Instance Hooks
 */

AppNotificationModel.afterCreate(instance => {
  if (instance.appDeviceId) {
    return AppDeviceModel.find({
      where: {
        $and: {
          id: instance.appDeviceId,
          $or: [
            { apnsSnsArn: { $ne: null } },
            { gcmSnsArn: { $ne: null } },
          ],
        },
      },
    }).then(appDevice => {
      appDevice.sendPushNotification(instance);
    });
  }

  if (instance.networkUserId) {
    return AppDeviceSessionModel.findAll({
      where: {
        networkUserId: 1,
        startedAt: {
          $eq: database.literal('(' +
            'SELECT MAX(`startedAt`)' +
            'FROM `appDeviceSessions` ' +
            'WHERE `appDeviceId` = `appDeviceSession`.`appDeviceId`' +
          ')'),
        },
      },
      include: {
        model: AppDeviceModel,
        where: {
          $or: [
            { apnsSnsArn: { $ne: null } },
            { gcmSnsArn: { $ne: null } },
          ],
        },
      },
    }).then(appDeviceSessions => {
      appDeviceSessions.forEach(appDeviceSession => {
        appDeviceSession.appDevice.sendPushNotification(instance);
      });
    });
  }
});

/*
 * Export
 */

module.exports = AppNotificationModel;
