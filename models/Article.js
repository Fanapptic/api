/*
 * Model Definition
 */

const ArticleModel = database.define('article', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  icon : {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  commentary: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  published: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  news: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

/*
 * Export
 */

module.exports = ArticleModel;
