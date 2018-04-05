/*
 * Model Definition
 */

const PostCommentReportModel = database.define('modules_community_postCommentReport', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  postCommentId: {
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

module.exports = PostCommentReportModel;
