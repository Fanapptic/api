module.exports = database.define('appAdRevenues', {
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
  amount: {
    type: Sequelize.DECIMAL(10, 2),
  },
});
