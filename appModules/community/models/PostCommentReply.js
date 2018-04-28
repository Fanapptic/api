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
  networkUserAttachmentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  content: {
    type: Sequelize.TEXT,
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
