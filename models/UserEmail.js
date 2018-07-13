/*
 * Model Definition
 */

const UserEmail = database.define('userEmail', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  source: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  subject: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT('medium'),
    allowNull: false,
  },
  plainContent: {
    type: Sequelize.TEXT('medium'),
    allowNull: false,
  },
  htmlContent: {
    type: Sequelize.TEXT('medium'),
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = UserEmail;
