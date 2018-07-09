/*
 * Model Definition
 */

const AppUserModel = database.define('appUser', {
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
  facebookId: {
    type: Sequelize.BIGINT.UNSIGNED,
    unique: true,
    allowNull: false,
  },
  facebookAccessToken: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  facebookAccountLink: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  ageRange: {
    type: Sequelize.JSON,
  },
  gender: {
    type: Sequelize.STRING,
  },
  locale: {
    type: Sequelize.STRING,
  },
  avatarUrl: {
    type: Sequelize.STRING,
  },
});

/*
 * Export
 */

module.exports = AppUserModel;
