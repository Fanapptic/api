const AppModuleModel = rootRequire('/models/AppModule');
const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('./Post');
const PostReportModel = require('./PostReport');
const PostCommentModel = require('./PostComment');
const PostCommentReplyModel = require('./PostCommentReply');
const PostCommentReplyReportModel = require('./PostCommentReplyReport');
const PostCommentReportModel = require('./PostCommentReport');
const PostCommentVoteModel = require('./PostCommentVote');
const PostVoteModel = require('./PostVote');

AppModuleModel.hasMany(PostModel);
PostModel.belongsTo(NetworkUserModel);
PostCommentModel.belongsTo(NetworkUserModel);
PostCommentReplyModel.belongsTo(NetworkUserModel);
PostCommentVoteModel.belongsTo(NetworkUserModel);
PostVoteModel.belongsTo(NetworkUserModel);
PostModel.hasMany(PostCommentModel, { as: 'comments', foreignKey: 'postId' });
PostModel.hasMany(PostReportModel, { as: 'reports', foreignKey: 'postId' });
PostModel.hasMany(PostVoteModel, { as: 'votes', foreignKey: 'postId' });
PostCommentModel.hasMany(PostCommentReplyModel, { as: 'replies', foreignKey: 'postCommentId' });
PostCommentModel.hasMany(PostCommentReportModel, { as: 'reports', foreignKey: 'postCommentId' });
PostCommentModel.hasMany(PostCommentVoteModel, { as: 'votes', foreignKey: 'postCommentId' });
PostCommentReplyModel.hasMany(PostCommentReplyReportModel, { as: 'report', foreignKey: 'postCommentReplyId' });

module.exports = {
  post: PostModel,
  postComment: PostCommentModel,
  postVote: PostVoteModel,
};
