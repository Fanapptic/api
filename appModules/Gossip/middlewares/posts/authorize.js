/*
 * Post Ownership Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/modules/:appModuleId/api/gossip/posts/:postId/*
 */

const PostModel = require('../../models/Post');

module.exports = (request, response, next) => {
  const { appModuleId, postId } = request.params;

  PostModel.find({
    where: {
      id: postId,
      appModuleId,
    },
  }).then(post => {
    if (!post) {
      return response.respond(403, 'The post accessed is not owned by this module.');
    }

    request.post = post;

    next();
  });
};
