/*
 * Model Definition
 */

const ArticleModel = database.define('articles', {
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
  draft: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
