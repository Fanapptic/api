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
    allowNull: false,
  },
  networkUserId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  rating: {
    type: Sequelize.INTEGER(1),
    allowNull: false,
    validate: {
      isIn: [[-1, 1]],
    },
  },
});

/*
 * Export
 */

module.exports = PostRatingModel;
