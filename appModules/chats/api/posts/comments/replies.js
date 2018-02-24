/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/comments/:postCommentId/replies/:postCommentReplyId
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostCommentReplyModel = require('../../../models/PostCommentReply');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const postAuthorize = require('../../../middlewares/posts/authorize');
const postCommentAuthorize = require('../../../middlewares/posts/comments/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', postAuthorize);
router.get('/', postCommentAuthorize);
router.get('/', (request, response, next) => {
  const { postCommentId, postCommentReplyId } = request.params;

  if (postCommentReplyId) {
    PostCommentReplyModel.find({
      where: { id: postCommentReplyId, postCommentId },
      include: [ NetworkUserModel ],
    }).then(postCommentReply => {
      if (!postCommentReply) {
        throw new Error('The post comment reply does not exist.');
      }

      response.success(postCommentReply);
    });
  } else {
    PostCommentReplyModel.findAll({
      where: { postCommentId },
      include: [ NetworkUserModel ],
      order: [['createdAt', 'ASC']],
    }).then(postCommentReplies => {
      response.success(postCommentReplies);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', postAuthorize);
router.post('/', postCommentAuthorize);
router.post('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { postCommentId } = request.params;
  const { content } = request.body;

  PostCommentReplyModel.create({ postCommentId, networkUserId, content }).then(postCommentReply => {
    response.success(postCommentReply);
  }).catch(next);
});

/*
 * DELETE
 */

router.delete('/', networkUserAuthorize);
router.delete('/', postAuthorize);
router.delete('/', postCommentAuthorize);
router.delete('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { postCommentReplyId } = request.params;

  PostCommentReplyModel.destroy({ where: { id: postCommentReplyId, networkUserId } }).then(affectedRows => {
    if (!affectedRows) {
      throw new Error('The post comment reply does not exist.');
    }

    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
