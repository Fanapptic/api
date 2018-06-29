/*
 * Model Definition
 */

const UserPayment = database.define('userCharge', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  details: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = UserPayment;
