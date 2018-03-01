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
    allowNull: false,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  modulePath: {
    type: Sequelize.STRING,
  },
  externalUrl: {
    type: Sequelize.TEXT,
  },
  parameters: {
    type: Sequelize.JSON,
  },
  preview: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

// create hook to send push?

/*
 * Export
 */

module.exports = AppNotificationModel;
