/*
 * Model Definition
 */

const PostRatingModel = database.define('modules_gossip_postRatings', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    unique: 'network_user_rating',
    allowNull: false,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    unique: 'network_user_rating',
    allowNull: false,
  },
  rating: {
    type: Sequelize.INTEGER(1),
    allowNull: false,
    validate: {
      isValid(value) {
        console.log(value);
        if (value != 0 && value != 1) {
          throw new Error('Rating must be 1 or 0.');
        }
      },
    },
  },
});

/*
 * Export
 */

module.exports = PostRatingModel;
