/*
 * Model Definition
 */

const AppModuleProviderDataModel = database.define('appModuleProviderData', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appModuleProviderId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = AppModuleProviderDataModel;
