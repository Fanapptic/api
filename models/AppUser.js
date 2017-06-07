const platforms = ['android', 'ios'];

/*
 * Model Definition
 */

const AppUserModel = database.define('appUsers', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
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

module.exports = AppUserModel;
