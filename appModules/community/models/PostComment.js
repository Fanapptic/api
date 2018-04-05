/*
 * Model Definition
 */

const PostCommentModel = database.define('modules_community_postComment', {
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
    validate: {
      isValid(value) {
        if (value.trim().length < 1) {
          throw new Error('Post must be at least one character long.');
        }
      },
    },
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
  totalReports: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
});

/*
 * Export
 */

module.exports = PostCommentModel;
