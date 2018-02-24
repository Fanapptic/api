const AppModuleModel = rootRequire('/models/AppModule');
const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('./Post');
const PostCommentModel = require('./PostComment');
const PostCommentReplyModel = require('./PostCommentReply');
const PostCommentVoteModel = require('./PostCommentVote');
const PostVoteModel = require('./PostVote');

AppModuleModel.hasMany(PostModel);
PostModel.belongsTo(NetworkUserModel);
PostCommentModel.belongsTo(NetworkUserModel);
PostCommentReplyModel.belongsTo(NetworkUserModel);
PostCommentVoteModel.belongsTo(NetworkUserModel);
PostVoteModel.belongsTo(NetworkUserModel);
PostModel.hasMany(PostCommentModel, { as: 'postComments', foreignKey: 'postId' });
PostModel.hasMany(PostVoteModel, { as: 'postVotes', foreignKey: 'postId' });
PostCommentModel.hasMany(PostCommentReplyModel, { as: 'postCommentReplies', foreignKey: 'postCommentId' });
PostCommentModel.hasMany(PostCommentVoteModel, { as: 'postCommentVotes', foreignKey: 'postCommentId' });

module.exports = {
  post: PostModel,
  postComment: PostCommentModel,
  postVote: PostVoteModel,
};
