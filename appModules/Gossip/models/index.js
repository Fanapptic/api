const AppModuleModel = rootRequire('/models/AppModule');
const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('./Post');
const PostCommentModel = require('./PostComment');
const PostRatingModel = require('./PostRating');

AppModuleModel.hasMany(PostModel);
PostModel.belongsTo(NetworkUserModel);
PostCommentModel.belongsTo(NetworkUserModel);
PostRatingModel.belongsTo(NetworkUserModel);
PostCommentModel.belongsTo(PostModel, { as: 'post' });
PostRatingModel.belongsTo(PostModel, { as: 'post' });

module.exports = {
  post: PostModel,
  postComment: PostCommentModel,
  postRating: PostRatingModel,
};
