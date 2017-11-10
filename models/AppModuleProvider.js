/*
 * Model Definition
 */

const AppModuleProviderModel = database.define('appModuleProviders', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appModuleId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  source: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  avatarUrl: {
    type: Sequelize.STRING,
  },
  accountId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accountName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accountUrl: {
    type: Sequelize.STRING,
  },
  accessToken: {
    type: Sequelize.TEXT('small'),
    allowNull: false,
  },
  accessTokenSecret: {
    type: Sequelize.TEXT('small'),
  },
  refreshToken: {
    type: Sequelize.TEXT('small'),
  },
});

/*
 * Export
 */

module.exports = AppModuleProviderModel;
