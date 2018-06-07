/*
 * Model Definition
 */

const AppSourceContent = database.define('appSourceContent', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  appSourceId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  publishedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = AppSourceContent;