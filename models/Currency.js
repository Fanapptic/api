const currencies = rootRequire('/config/currencies');

/*
 * Model Definition
 */

const CurrencyModel = database.define('currencies', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  isoCode: {
    type: Sequelize.STRING(3),
  },
  exchangeRate: {
    type: Sequelize.DECIMAL(10, 5),
    defaultValue: 0,
  },
  symbol: {
    type: Sequelize.STRING(5),
  },
  unicode: {
    type: Sequelize.STRING(32),
  },
  position: {
    type: Sequelize.ENUM('before', 'after'),
  },
}, {
  timestamps: false,
  paranoid: false,
});

/*
 * Instance Hooks
 */

CurrencyModel.hook('afterSync', function() {
  return this.count({
    limit: 1,
  }).then(currenciesCount => {
    if (currenciesCount === 0) {
      this.bulkCreate(currencies);
    }
  });
});

/*
 * Export
 */

module.exports = CurrencyModel;
