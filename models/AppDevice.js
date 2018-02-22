const platforms = ['android', 'ios'];

/*
 * Model Definition
 */

const AppDeviceModel = database.define('appDevice', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  accessToken: {
    type: Sequelize.UUID,
    unique: true,
    defaultValue: Sequelize.UUIDV1,
  },
  deviceDetails: {
    type: Sequelize.JSON,
  },
  platform: {
    type: Sequelize.ENUM(...platforms),
    allowNull: false,
    validate: {
      isIn: {
        args: [platforms],
        msg: 'The platform provided is invalid.',
      },
    },
  },
});

/*
 * Export
 */

module.exports = AppDeviceModel;
