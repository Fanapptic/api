/*
 * Gossip API
 * Base Route: /apps/:appId/modules/:appModuleId/api/gossip
 */

const postsRouter = require('./posts');
const postCommentsRouter = require('./posts/comments');
const postRatingsRouter = require('./posts/ratings');

const router = express.Router({
  mergeParams: true,
});

/*
 * Routes
 */

router.use('/posts/:postId?', postsRouter);
router.use('/posts/:postId/comments/:postCommentId?', postCommentsRouter);
router.use('/posts/:postId/ratings/:postRatingId?', postRatingsRouter);

/*
 * Export
 */

module.exports = router;
