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
  totalUpvotes: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  totalDownvotes: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  totalReplies: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
});

/*
 * Export
 */

module.exports = PostCommentModel;
