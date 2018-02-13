/*
 * Chat API
 * Base Route: /apps/:appId/modules/:appModuleId/api/chat
 */

const postsRouter = require('./posts');
const postCommentsRouter = require('./posts/comments');
const postVotesRouter = require('./posts/votes');

const router = express.Router({
  mergeParams: true,
});

/*
 * Routes
 */

router.use('/posts/:postId?', postsRouter);
router.use('/posts/:postId/comments/:postCommentId?', postCommentsRouter);
router.use('/posts/:postId/votes/:postVoteId?', postVotesRouter);

/*
 * Export
 */

module.exports = router;
