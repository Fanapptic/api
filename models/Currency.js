const currencies = rootRequire('/config/currencies');
const positions = ['before', 'after'];

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
    allowNull: false,
  },
  exchangeRate: {
    type: Sequelize.DECIMAL(10, 5),
    allowNull: false,
    defaultValue: 0,
  },
  symbol: {
    type: Sequelize.STRING(5),
    allowNull: false,
  },
  unicode: {
    type: Sequelize.STRING(32),
    allowNull: false,
  },
  position: {
    type: Sequelize.ENUM(...positions),
    allowNull: false,
    validate: {
      isIn: {
        args: [positions],
        msg: 'The position provided is invalid.',
      },
    },
  },
}, {
  timestamps: false,
  paranoid: false,
});

/*
 * Instance Hooks
 */

CurrencyModel.hook('afterSync', function() {
  return this.count().then(currenciesCount => {
    if (currenciesCount === 0) {
      this.bulkCreate(currencies);
    }
  });
});

/*
 * Export
 */

module.exports = CurrencyModel;
