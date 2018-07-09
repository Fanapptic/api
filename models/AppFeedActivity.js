const types = ['view', 'share'];

/*
 * Model Definition
 */

const AppFeedActivity = database.define('appFeedActivity', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  appDeviceId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  appUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  appDeviceSessionId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  appSourceContentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [ types ],
        msg: 'The type provided is invalid.',
      },
    },
  },
});

/*
 * Export
 */

module.exports = AppFeedActivity;
