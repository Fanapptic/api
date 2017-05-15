module.exports = database.define('appUsers', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
});
