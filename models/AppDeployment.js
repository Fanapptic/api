const AppModel = rootRequire('/models/App');

/*
 * Model Definition
 */

const AppDeploymentModel = database.define('appDeployments', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  snapshot: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        if (!(value instanceof AppModel)) {
          throw new Error('Snapshot must be an instance of AppModel.');
        }

        return true;
      },
    },
  },
});

/*
 * Export
 */

module.exports = AppDeploymentModel;
