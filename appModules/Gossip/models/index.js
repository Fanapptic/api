const AppModuleModel = rootRequire('/models/AppModule');
const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('./Post');
const PostCommentModel = require('./PostComment');
const PostVoteModel = require('./PostVote');

AppModuleModel.hasMany(PostModel);
PostModel.belongsTo(NetworkUserModel);
PostCommentModel.belongsTo(NetworkUserModel);
PostVoteModel.belongsTo(NetworkUserModel);
PostCommentModel.belongsTo(PostModel, { as: 'post' });
PostVoteModel.belongsTo(PostModel, { as: 'post' });

module.exports = {
  post: PostModel,
  postComment: PostCommentModel,
  postVote: PostVoteModel,
};
