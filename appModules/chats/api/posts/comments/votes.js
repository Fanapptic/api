/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/comments/:postCommentId/votes/:postCommentVoteId?
 */

const PostCommentModel = require('../../../models/PostComment');
const PostCommentVoteModel = require('../../../models/PostCommentVote');
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
  const networkUserId = request.networkUser.id;
  const { postCommentId } = request.params;
  const { vote } = request.body;

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
