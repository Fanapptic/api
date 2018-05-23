/*
 * Route: /apps/:appId/modules/:appModuleId/api/community/posts/:postId/comments/:postCommentId/replies/:postCommentReplyId
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
const NetworkUserAttachmentModel = rootRequire('/models/NetworkUserAttachment');
const PostCommentModel = require('../../../models/PostComment');
const PostCommentReplyModel = require('../../../models/PostCommentReply');
const AppNotificationModel = rootRequire('/models/AppNotification');
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
      include: [
        NetworkUserModel,
        {
          model: NetworkUserAttachmentModel,
          required: false,
        },
      ],
    }).then(postCommentReply => {
      if (!postCommentReply) {
        throw new Error('The post comment reply does not exist.');
      }

      response.success(postCommentReply);
    });
  } else {
    PostCommentReplyModel.findAll({
      where: { postCommentId },
      include: [
        NetworkUserModel,
        {
          model: NetworkUserAttachmentModel,
          required: false,
        },
      ],
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
  const { networkUser } = request;
  const { appId, appModuleId, postId, postCommentId } = request.params;
  const { networkUserAttachmentId, content } = request.body;
  const networkUserId = networkUser.id;
  const postCommentNetworkUserId = request.postComment.networkUserId;

  let postCommentReply = null;

  if (!networkUserAttachmentId && (!content || !content.trim().length)) {
    throw new Error('networkUserAttachmentId or content must be provided.');
  }

  // TODO: use transaction
  PostCommentReplyModel.create({ postCommentId, networkUserId, networkUserAttachmentId, content }).then(_postCommentReply => {
    postCommentReply = _postCommentReply;

    if (networkUserId !== postCommentNetworkUserId) {
      const contentMessage = (postCommentReply.content) ? `: ${postCommentReply.content}` : ' with an attachment.';

      AppNotificationModel.create({
        appId,
        appModuleId,
        networkUserId: postCommentNetworkUserId,
        moduleRelativeUrl: '/post',
        parameters: { postId },
        previewImageUrl: networkUser.avatarUrl,
        content: `${networkUser.firstName} ${networkUser.lastName} replied to your comment${contentMessage}`,
      }).catch(error => console.log(error));
    }

    return PostCommentModel.update({
      totalReplies: database.literal('totalReplies + 1'),
    }, {
      where: { id: postCommentId },
    });
  }).then(() => {
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

  let existingPostCommentReply = null;

  // TODO: use transaction
  PostCommentReplyModel.find({ where: { id: postCommentReplyId, networkUserId } }).then(postCommentReply => {
    if (!postCommentReply) {
      throw new Error('The post comment reply does not exist.');
    }

    existingPostCommentReply = postCommentReply;

    return PostCommentReplyModel.destroy({ where: { id: postCommentReplyId, networkUserId } });
  }).then(() => {
    return PostCommentModel.update({
      totalReplies: database.literal('totalReplies - 1'),
    }, {
      where: { id: existingPostCommentReply.postCommentId },
    });
  }).then(() => {
    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
