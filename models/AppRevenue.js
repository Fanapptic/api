/*
 * Model Definition
 */

const AppRevenueModel = database.define('appRevenue', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  currencyId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['ad']],
        msg: 'The type provided is invalid.',
      },
    },
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = AppRevenueModel;
