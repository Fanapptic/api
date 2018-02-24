/*
 * Model Definition
 */

const PostCommentVoteModel = database.define('modules_chats_postCommentVote', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  postCommentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    unique: 'network_user_vote',
    allowNull: false,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    unique: 'network_user_vote',
    allowNull: false,
  },
  vote: {
    type: Sequelize.INTEGER(1),
    allowNull: false,
    validate: {
      isValid(value) {
        if (value != -1 && value != 1) {
          throw new Error('Vote must be -1 or 1.');
        }
      },
    },
  },
});

/*
 * Export
 */

module.exports = PostCommentVoteModel;
