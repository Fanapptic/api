/*
 * Model Definition
 */

const PostModel = database.define('modules_chats_post', {
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
    validate: {
      isValid(value) {
        if (value.length < 10) {
          throw new Error('Post must be at least 10 characters long.');
        }
      },
    },
  },
  totalUpvotes: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    defaultValue: 0,
  },
  totalDownvotes: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    defaultValue: 0,
  },
  totalComments: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    defaultValue: 0,
  },
});

/*
 * Export
 */

module.exports = PostModel;
