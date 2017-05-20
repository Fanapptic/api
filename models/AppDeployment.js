/*
 * Model Definition
 */

const AppDeployment = database.define('appDeployments', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
});

/*
 * Export
 */

module.exports = AppDeployment;