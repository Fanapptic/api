/*
 * Model Definition
 */

const PostCommentReplyModel = database.define('modules_community_postCommentReply', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  postCommentId: {
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
  totalReports: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
});

/*
 * Export
 */

module.exports = PostCommentReplyModel;
