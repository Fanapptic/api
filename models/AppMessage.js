/*
 * Model Definition
 */

const AppMessage = database.define('appMessage', {
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
  appSourceContentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  name: {
    type: Sequelize.STRING,
    defaultValue: 'Anonymous',
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = AppMessage;
