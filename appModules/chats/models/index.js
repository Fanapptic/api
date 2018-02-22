const AppModuleModel = rootRequire('/models/AppModule');
const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('./Post');
const PostCommentModel = require('./PostComment');
const PostVoteModel = require('./PostVote');

AppModuleModel.hasMany(PostModel);
PostModel.belongsTo(NetworkUserModel);
PostCommentModel.belongsTo(NetworkUserModel);
PostVoteModel.belongsTo(NetworkUserModel);
PostModel.hasMany(PostCommentModel, { as: 'postComments', foreignKey: 'postId' });
PostModel.hasMany(PostVoteModel, { as: 'postVotes', foreignKey: 'postId' });

module.exports = {
  post: PostModel,
  postComment: PostCommentModel,
  postVote: PostVoteModel,
};
