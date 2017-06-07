/*
 * Model Definition
 */

const AppModuleDataModel = database.define('appModuleData', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appModuleId: {
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

module.exports = AppModuleDataModel;
