/*
 * Model Definition
 */

const PostModel = database.define('modules_community_post', {
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
  networkUserAttachmentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  content: {
    type: Sequelize.TEXT,
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
  totalComments: {
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

module.exports = PostModel;
