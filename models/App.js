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
 * Instance Methods / Overrides
 */

App.userHasPermission = (id, userId) => {
  return App.findAndCountAll({
    where: {
      id,
      userId,
    },
    limit: 1,
  }).then(userHasPermission => {
    if (!userHasPermission) {
      throw new Error('Insufficient application permissions.');
    }

    return;
  });
};

/*
 * Export
 */

module.exports = App;
