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
  appDeviceId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  appSourceContentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  url: {
    type: Sequelize.TEXT,
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  message: {
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
  database.models.appDevice.findAll({
    where: {
      id: instance.appDeviceId,
      $or: [
        { apnsSnsArn: { $ne: null } },
        { gcmSnsArn: { $ne: null } },
      ],
    },
  }).then(appDevices => {
    appDevices.forEach(appDevice => {
      appDevice.sendPushNotification(instance);
    });
  });
}

/*
 * Export
 */

module.exports = AppNotificationModel;
