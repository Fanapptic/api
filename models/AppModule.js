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
  moduleId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  config: {
    type: Sequelize.JSON,
  },
});

/*
 * Export
 */

module.exports = AppModule;
