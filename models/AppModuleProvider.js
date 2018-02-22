/*
 * Model Definition
 */

const AppModuleProviderModel = database.define('appModuleProvider', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appModuleId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  dataSource: {
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
 * Instance Methods / Overrides
 */

AppModuleProviderModel.prototype.toJSON = function() {
  let appModuleProvider = this.get();

  // We never want to return the appModule Provider's
  // accessToken, accessTokenSecret and refreshToken
  delete appModuleProvider.accessToken;
  delete appModuleProvider.accessTokenSecret;
  delete appModuleProvider.refreshToken;

  return appModuleProvider;
};

/*
 * Export
 */

module.exports = AppModuleProviderModel;
