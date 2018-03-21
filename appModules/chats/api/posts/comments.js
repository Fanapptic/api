/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/comments/:postCommentId?
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('../../models/Post');
const PostCommentModel = require('../../models/PostComment');
const PostCommentReplyModel = require('../../models/PostCommentReply');
const PostCommentVoteModel = require('../../models/PostCommentVote');
const AppNotificationModel = rootRequire('/models/AppNotification');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const networkUserAuthorizeOptional = rootRequire('/middlewares/networks/users/authorizeOptional');
const postAuthorize = require('../../middlewares/posts/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', networkUserAuthorizeOptional);
router.get('/', postAuthorize);
router.get('/', (request, response, next) => {
  const { postId, postCommentId } = request.params;

  let attributes = Object.keys(PostCommentModel.attributes);

  if (request.networkUser.id) {
    attributes = attributes.concat([
      [database.literal('(' +
        'SELECT `modules_chats_postCommentVotes`.`vote` ' +
        'FROM `modules_chats_postCommentVotes` ' +
        'WHERE `modules_chats_postCommentVotes`.`postCommentId` = `modules_chats_postComment`.`id` ' +
        'AND `modules_chats_postCommentVotes`.`networkUserId` = ' + request.networkUser.id +
      ')'), 'loggedInNetworkUserVote'],
    ]);
  }

  if (postCommentId) {
    PostCommentModel.find({
      attributes,
      where: { id: postCommentId, postId },
      include: [
        NetworkUserModel,
        {
          model: PostCommentReplyModel,
          as: 'replies',
          include: [ NetworkUserModel ],
        },
      ],
    }).then(postComment => {
      if (!postComment) {
        throw new Error('The post comment does not exist.');
      }

      response.success(postComment);
    }).catch(next);
  } else {
    PostCommentModel.findAll({
      attributes,
      where: { postId },
      include: [
        NetworkUserModel,
        {
          model: PostCommentReplyModel,
          as: 'replies',
          include: [ NetworkUserModel ],
        },
      ],
      order: [['totalUpvotes', 'DESC'], ['createdAt', 'DESC']],
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
  const { networkUser } = request;
  const { appId, appModuleId, postId } = request.params;
  const { content } = request.body;
  const networkUserId = networkUser.id;
  const postNetworkUserId = request.post.networkUserId;
  const totalUpvotes = 1;

  let postComment = null;

  // TODO: use transaction
  PostCommentModel.create({ postId, networkUserId, content, totalUpvotes }).then(_postComment => {
    postComment = _postComment;

    if (networkUserId !== postNetworkUserId) {
      AppNotificationModel.create({
        appId,
        appModuleId,
        networkUserId: postNetworkUserId,
        relativeUrl: '/post',
        parameters: { postId },
        previewImageUrl: networkUser.avatarUrl,
        content: `${networkUser.firstName} ${networkUser.lastName} commented on your post!`,
      }).catch(error => console.log(error));
    }

    return PostModel.update({
      totalComments: database.literal('totalComments + 1'),
    }, {
      where: { id: postId },
    });
  }).then(() => {
    return PostCommentVoteModel.create({ postCommentId: postComment.id, networkUserId, vote: 1 });
  }).then(() => {
    postComment = postComment.toJSON();
    postComment.loggedInNetworkUserVote = 1;

    response.success(postComment);
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
      totalComments: database.literal('totalComments - 1'),
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
