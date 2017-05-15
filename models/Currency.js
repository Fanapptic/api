const currencies = rootRequire('/config/currencies');

module.exports = database.define('currencies', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  isoCode: {
    type: Sequelize.STRING(3),
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
  hooks: {
    afterSync: function() {
      tableSetup(this);
    },
  },
});

function tableSetup(definition) {
  return definition.findAndCountAll({
    limit: 1,
  }).then((result) => {
    if (result.count === 0) {
      definition.bulkCreate(currencies);
    }
  });
}
