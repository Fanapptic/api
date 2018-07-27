/*
 * Model Definition
 */

const AppSourceContentLike = database.define('appSourceContentLike', {
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
  appSourceContentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = AppSourceContentLike;
