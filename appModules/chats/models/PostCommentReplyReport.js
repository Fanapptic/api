/*
 * Model Definition
 */

const PostCommentReplyReportModel = database.define('modules_chats_postCommentReplyReport', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  postCommentReplyId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    unique: 'network_user_report',
    allowNull: false,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    unique: 'network_user_report',
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = PostCommentReplyReportModel;
