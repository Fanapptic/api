/*
 * Model Definition
 */

const PostModel = database.define('modules_chats_posts', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  appModuleId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  upvotes: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    defaultValue: 0,
  },
  downvotes: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    defaultValue: 0,
  },
});

/*
 * Export
 */

module.exports = PostModel;
