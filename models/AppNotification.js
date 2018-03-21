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

// create hook to send push?

/*
 * Export
 */

module.exports = AppNotificationModel;
