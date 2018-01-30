const platforms = ['android', 'ios'];

/*
 * Model Definition
 */

const AppDeviceModel = database.define('appDevices', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  uuid: {
    type: Sequelize.UUID,
    unique: true,
    defaultValue: Sequelize.UUIDV1,
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