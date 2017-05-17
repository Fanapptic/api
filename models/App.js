/*
 * Model Definition
 */

const App = database.define('apps', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  statusBarConfig: {
    type: Sequelize.JSON,
  },
  tabBarConfig: {
    type: Sequelize.JSON,
  },
  deployedVersion: {
    type: Sequelize.STRING,
  },
});

/*
 * Export
 */

module.exports = App;
