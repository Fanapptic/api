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
    allowNull: false,
  },
  appDeviceId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  location: {
    type: Sequelize.JSON,
  },
  startedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  endedAt: {
    type: Sequelize.DATE,
  },
}, {
  timestamps: false,
  paranoid: false,
});

/*
 * Export
 */

module.exports = AppSessionModel;
