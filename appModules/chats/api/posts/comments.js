/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/comments/:postCommentId?
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('../../models/Post');
const PostCommentModel = require('../../models/PostComment');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const postAuthorize = require('../../middlewares/posts/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', postAuthorize);
router.get('/', (request, response, next) => {
  const { postId, postCommentId } = request.params;

  if (postCommentId) {
    PostCommentModel.find({
      where: { id: postCommentId, postId },
      include: [ NetworkUserModel ],
    }).then(postComment => {
      if (!postComment) {
        throw new Error('The post comment does not exist.');
      }

      response.success(postComment);
    }).catch(next);
  } else {
    PostCommentModel.findAll({
      where: { postId },
      include: [ NetworkUserModel ],
      order: [['createdAt', 'DESC']],
    }).then(postComments => {
      response.success(postComments);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', postAuthorize);
router.post('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { postId } = request.params;
  const { content } = request.body;

  let createPostComment = null;

  // TODO: use transaction
  PostCommentModel.create({ postId, networkUserId, content }).then(postComment => {
    createPostComment = postComment;

    return PostModel.update({
      comments: database.literal('comments + 1'),
    }, {
      where: { id: postId },
    });
  }).then(() => {
    response.success(createPostComment);
  }).catch(next);
});

/*
 * DELETE
 */

router.delete('/', networkUserAuthorize);
router.delete('/', postAuthorize);
router.delete('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { postCommentId } = request.params;

  let existingPostComment = null;

  // TODO: use transaction
  PostCommentModel.find({ where: { id: postCommentId, networkUserId } }).then(postComment => {
    if (!postComment) {
      throw new Error('The post comment does not exist.');
    }

    existingPostComment = postComment;

    return PostCommentModel.destroy({ where: { id: postCommentId, networkUserId } });
  }).then(() => {
    return PostModel.update({
      comments: database.literal('comments - 1'),
    }, {
      where: { id: existingPostComment.postId },
    });
  }).then(() => {
    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
