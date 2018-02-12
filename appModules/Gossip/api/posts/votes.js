/*
 * Route: /apps/:appId/modules/:appModuleId/api/gossip/posts/:postId/votes/:postVoteId?
 */

const PostModel = require('../../models/Post');
const PostVoteModel = require('../../models/PostVote');
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
  const networkUserId = request.networkUser.id;
  const { postId } = request.params;
  const { vote } = request.body;

  let existingPostVote = null;
  let upsertPostVote = null;

  PostVoteModel.find({ where: { postId, networkUserId } }).then(postVote => {
    existingPostVote = postVote;

    return PostVoteModel.upsert({ postId, networkUserId, vote });
  }).then(() => {
    return PostVoteModel.find({ where: { postId, networkUserId } });
  }).then(postVote => {
    upsertPostVote = postVote;

    let upvotesIncrement = (existingPostVote && existingPostVote.vote == 1) ? -1 : 0;
    upvotesIncrement += (upsertPostVote.vote == 1) ? 1 : 0;

    let downvotesIncrement = (existingPostVote && existingPostVote.vote == -1) ? -1 : 0;
    downvotesIncrement += (upsertPostVote.vote == -1) ? 1 : 0;

    return PostModel.update({
      upvotes: database.literal(`upvotes + ${upvotesIncrement}`),
      downvotes: database.literal(`downvotes + ${downvotesIncrement}`),
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
