/*
 * Model Definition
 */

const AppPushNotificationModel = database.define('appPushNotifications', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  message: {
    type: Sequelize.STRING,
  },
  targetUrl: {
    type: Sequelize.STRING,
  },
});

/*
 * Export
 */

module.exports = AppPushNotificationModel;
