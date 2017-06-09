const Snapshot = rootRequire('/libs/App/Snapshot');
const deploymentTypes = ['hard', 'soft'];

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
  deploymentType: {
    type: Sequelize.ENUM(...deploymentTypes),
    validate: {
      isIn: {
        args: [deploymentTypes],
        msg: 'The deployment type provided is invalid.',
      },
    },
  },
  snapshot: {
    type: Sequelize.JSON,
    allowNull: false,
    validate: {
      isValid(value) {
        if (!(value instanceof Snapshot)) {
          throw new Error('Snapshot must be an instance of Snapshot.');
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
 * Instance Methods / Overrides
 */

AppDeploymentModel.shouldHardDeploy = function(againstSnapshot) {
  for (let key in againstSnapshot) {
    if (this.snapshot[key] != againstSnapshot[key] && againstSnapshot[key] !== 'object') {
      return true;
    }
  }

  return false;
};

AppDeploymentModel.shouldSoftDeploy = function(againstSnapshot) {

};

AppDeploymentModel.deploy = function() {

};

/*
 * Export
 */

module.exports = AppDeploymentModel;
