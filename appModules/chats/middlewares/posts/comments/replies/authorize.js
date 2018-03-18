/*
 * Post Comment Reply Ownership Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/comments/:postCommentId/replies/:postCommentReplyId/*
 */

const PostCommentReplyModel = require('../../../../models/PostCommentReply');

module.exports = (request, response, next) => {
  const { postCommentId, postCommentReplyId } = request.params;

  PostCommentReplyModel.find({
    where: {
      id: postCommentReplyId,
      postCommentId,
    },
  }).then(postCommentReply => {
    if (!postCommentReply) {
      return response.respond(403, 'The post comment reply accessed is not owned by this post comment.');
    }

    request.postCommentReply = postCommentReply;

    next();
  });
};
