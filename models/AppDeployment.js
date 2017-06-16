const Snapshot = rootRequire('/libs/App/Snapshot');
const types = ['hard', 'soft'];
const statuses = ['pending', 'complete', 'failed'];

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
  type: {
    type: Sequelize.ENUM(...types),
    validate: {
      isIn: {
        args: [types],
        msg: 'The type provided is invalid.',
      },
    },
  },
  status: { // TODO: Implement Deployment Status
    type: Sequelize.ENUM(...statuses),
    validate: {
      isIn: {
        args: [statuses],
        msg: 'The status provided is invalid.',
      },
    },
    defaultValue: 'pending',
  },
  snapshot: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        if (!(value instanceof Snapshot)) {
          throw new Error('snapshot must be an instance of Snapshot.');
        }

        return true;
      },
    },
  },
  deployedAt: {
    type: Sequelize.DATE,
  },
});

/*
 * Export
 */

module.exports = AppDeploymentModel;
