/*
 * Model Definition
 */

const PostVoteModel = database.define('modules_community_postVote', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
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

module.exports = PostVoteModel;
