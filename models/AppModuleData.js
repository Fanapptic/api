/*
 * Model Definition
 */

const AppModuleData = database.define('appModuleData', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appModuleId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  data: {
    type: Sequelize.JSON,
  },
});

/*
 * Export
 */

module.exports = AppModuleData;
