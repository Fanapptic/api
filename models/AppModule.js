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
  navigatorConfig: {
    type: Sequelize.JSON,
  },
  tabConfig: {
    type: Sequelize.JSON,
  },
  dataSources: {
    type: Sequelize.JSON,
  },
  options: {
    type: Sequelize.JSON,
  },
  styles: {
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
