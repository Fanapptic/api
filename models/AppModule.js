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
