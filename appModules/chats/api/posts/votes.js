/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/votes/:postVoteId?
 */

const PostModel = require('../../models/Post');
const PostVoteModel = require('../../models/PostVote');
const AppNotificationModel = rootRequire('/models/AppNotification');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const postAuthorize = require('../../middlewares/posts/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', postAuthorize);
router.post('/', (request, response, next) => {
  const { networkUser } = request;
  const { appId, appModuleId, postId } = request.params;
  const { vote } = request.body;
  const networkUserId = networkUser.id;
  const postNetworkUserId = request.post.networkUserId;

  let existingPostVote = null;
  let upsertPostVote = null;

  // TODO: This should be done as a transaction
  PostVoteModel.find({ where: { postId, networkUserId } }).then(postVote => {
    existingPostVote = postVote;

    return PostVoteModel.upsert({ postId, networkUserId, vote });
  }).then(() => {
    return PostVoteModel.find({ where: { postId, networkUserId } });
  }).then(postVote => {
    upsertPostVote = postVote;

    if (!existingPostVote && networkUserId !== postNetworkUserId) {
      const action = (vote === 1) ? 'upvoted' : 'downvoted';
      const notificationContent = `${networkUser.firstName} ${networkUser.lastName} ${action} your post!`;

      AppNotificationModel.create({
        appId,
        appModuleId,
        networkUserId: postNetworkUserId,
        relativeUrl: '/post',
        parameters: { postId },
        preview: notificationContent,
        content: notificationContent,
      }).catch(error => console.log(error));
    }

    let totalUpvotesIncrement = (existingPostVote && existingPostVote.vote == 1) ? -1 : 0;
    totalUpvotesIncrement += (upsertPostVote.vote == 1) ? 1 : 0;

    let totalDownvotesIncrement = (existingPostVote && existingPostVote.vote == -1) ? -1 : 0;
    totalDownvotesIncrement += (upsertPostVote.vote == -1) ? 1 : 0;

    return PostModel.update({
      totalUpvotes: database.literal(`totalUpvotes + ${totalUpvotesIncrement}`),
      totalDownvotes: database.literal(`totalDownvotes + ${totalDownvotesIncrement}`),
    }, {
      where: { id: postId },
    });
  }).then(() => {
    response.success(upsertPostVote);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
