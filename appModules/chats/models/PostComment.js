/*
 * Model Definition
 */

const PostCommentModel = database.define('modules_chats_postComment', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
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

module.exports = PostCommentModel;
