/*
 * Model Definition
 */

const NetworkUserModel = database.define('networkUser', {
  id: {
    type:Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  accessToken: {
    type: Sequelize.UUID,
    unique: true,
    defaultValue: Sequelize.UUIDV1,
    get() {
      if (this.includeAccessTokens) {
        return this.getDataValue('accessToken');
      } else {
        delete this.accessToken;
      }
    },
  },
  facebookId: {
    type: Sequelize.BIGINT.UNSIGNED,
    unique: true,
    allowNull: false,
  },
  facebookAccessToken: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      if (this.includeAccessTokens) {
        return this.getDataValue('facebookAccessToken');
      } else {
        delete this.facebookAccessToken;
      }
    },
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

module.exports = NetworkUserModel;
