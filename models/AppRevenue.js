/*
 * Model Definition
 */

const AppRevenue = database.define('appRevenues', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  currencyId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  type: {
    type: Sequelize.STRING,
    validate: {
      isIn: {
        args: [['ad']],
        msg: 'The type provided is invalid.',
      },
    },
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
  },
});

/*
 * Export
 */

module.exports = AppRevenue;
