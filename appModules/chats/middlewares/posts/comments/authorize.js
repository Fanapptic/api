/*
 * Post Comment Ownership Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/comments/:postCommentId/*
 */

const PostCommentModel = require('../../../models/PostComment');

module.exports = (request, response, next) => {
  const { postId, postCommentId } = request.params;

  PostCommentModel.find({
    where: {
      id: postCommentId,
      postId,
    },
  }).then(postComment => {
    if (!postComment) {
      return response.respond(403, 'The post comment accessed is not owned by this post.');
    }

    request.postComment = postComment;

    next();
  });
};
