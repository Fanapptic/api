/*
 * Model Definition
 */

const AppModule = database.define('appModules', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  moduleName: {
    type: Sequelize.STRING,
  },
  moduleConfig: {
    type: Sequelize.JSON,
  },
  navigatorConfig: {
    type: Sequelize.JSON,
  },
  tabConfig: {
    type: Sequelize.JSON,
  },
  position: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
});

/*
 * Export
 */

module.exports = AppModule;
