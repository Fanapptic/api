/*
 * Model Definition
 */

const AppSessionModel = database.define('appSessions', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  appUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  durationSeconds: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
});

/*
 * Export
 */

module.exports = AppSessionModel;
