const AppDeviceModel = rootRequire('/models/AppDevice');

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

AppNotificationModel.afterCreate(afterCreate);
AppNotificationModel.afterBulkCreate(instances => {
  instances.forEach(instance => afterCreate(instance));
});

function afterCreate(instance) {
  AppDeviceModel.findAll({
    where: {
      $and: {
        id: (instance.appDeviceId) ? instance.appDeviceId : null,
        networkUserId: (instance.networkUserId) ? instance.networkUserId : null,
        $or: [
          { apnsSnsArn: { $ne: null } },
          { gcmSnsArn: { $ne: null } },
        ],
      },
    },
  }).then(appDevices => {
    console.log('SENDING NOTIFICATION TO...');
    console.log(appDevices);
    appDevices.forEach(appDevice => {
      appDevice.sendPushNotification(instance);
    });
  });
}

/*
 * Export
 */

module.exports = AppNotificationModel;
