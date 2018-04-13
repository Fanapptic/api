const platforms = ['android', 'ios'];

/*
 * Model Definition
 */

const AppDeploymentStep = database.define('appDeploymentStep', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appDeploymentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  platform: {
    type: Sequelize.STRING,
    validate: {
      isIn: {
        args: [platforms],
        msg: 'The platform provided is invalid.',
      },
    },
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  success: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = AppDeploymentStep;
