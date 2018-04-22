/*
 * Model Definition
 */

const NetworkUserMediaModel = database.define('networkUserMedia', {
  id: {
    type:Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  url: {
    type: Sequelize.STRING,
  },
  contentType: {
    type: Sequelize.STRING,
  },
});

/*
 * Export
 */

module.exports = NetworkUserMediaModel;
