/*
 * Model Definition
 */

const PostReportModel = database.define('modules_community_postReport', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
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

module.exports = PostReportModel;
