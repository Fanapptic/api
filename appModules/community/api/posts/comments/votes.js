/*
 * Route: /apps/:appId/modules/:appModuleId/api/community/posts/:postId/comments/:postCommentId/votes/:postCommentVoteId?
 */

const PostCommentModel = require('../../../models/PostComment');
const PostCommentVoteModel = require('../../../models/PostCommentVote');
const AppNotificationModel = rootRequire('/models/AppNotification');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const postAuthorize = require('../../../middlewares/posts/authorize');
const postCommentAuthorize = require('../../../middlewares/posts/comments/authorize');

const router = express.Router({
  mergeParams: true,
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
  const { vote } = request.body;
  const networkUserId = networkUser.id;
  const postCommentNetworkUserId = request.postComment.networkUserId;

  let existingPostCommentVote = null;
  let upsertPostCommentVote = null;

  // TODO: This should be done as a transaction
  PostCommentVoteModel.find({ where: { postCommentId, networkUserId } }).then(postCommentVote => {
    existingPostCommentVote = postCommentVote;

    return PostCommentVoteModel.upsert({ postCommentId, networkUserId, vote });
  }).then(() => {
    return PostCommentVoteModel.find({ where: { postCommentId, networkUserId } });
  }).then(postCommentVote => {
    upsertPostCommentVote = postCommentVote;

    if (!existingPostCommentVote && vote === 1 && networkUserId != postCommentNetworkUserId) {
      AppNotificationModel.create({
        appId,
        appModuleId,
        networkUserId: postCommentNetworkUserId,
        moduleRelativeUrl: '/post',
        parameters: { postId },
        previewImageUrl: networkUser.avatarUrl,
        content: `${networkUser.firstName} ${networkUser.lastName} upvoted your comment!`,
      }).catch(error => console.log(error));
    }

    let totalUpvotesIncrement = (existingPostCommentVote && existingPostCommentVote.vote == 1) ? -1 : 0;
    totalUpvotesIncrement += (upsertPostCommentVote.vote == 1) ? 1 : 0;

    let totalDownvotesIncrement = (existingPostCommentVote && existingPostCommentVote.vote == -1) ? -1 : 0;
    totalDownvotesIncrement += (upsertPostCommentVote.vote == -1) ? 1 : 0;

    return PostCommentModel.update({
      totalUpvotes: database.literal(`totalUpvotes + ${totalUpvotesIncrement}`),
      totalDownvotes: database.literal(`totalDownvotes + ${totalDownvotesIncrement}`),
    }, {
      where: { id: postCommentId },
    });
  }).then(() => {
    response.success(upsertPostCommentVote);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
