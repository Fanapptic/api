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
    unique: true,
    defaultValue: Sequelize.UUIDV1,
  },
});
