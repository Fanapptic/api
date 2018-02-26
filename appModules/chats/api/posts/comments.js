/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/comments/:postCommentId?
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('../../models/Post');
const PostCommentModel = require('../../models/PostComment');
const PostCommentReplyModel = require('../../models/PostCommentReply');
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
  const networkUserId = request.networkUser.id;
  const { postId } = request.params;
  const { content } = request.body;

  let createdPostComment = null;

  // TODO: use transaction
  PostCommentModel.create({ postId, networkUserId, content }).then(postComment => {
    createdPostComment = postComment;

    return PostModel.update({
      totalComments: database.literal('totalComments + 1'),
    }, {
      where: { id: postId },
    });
  }).then(() => {
    response.success(createdPostComment);
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
