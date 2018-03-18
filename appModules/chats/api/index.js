/*
 * Chats API
 * Base Route: /apps/:appId/modules/:appModuleId/api/chats
 */

const postsRouter = require('./posts');
const postCommentsRouter = require('./posts/comments');
const postCommentRepliesRouter = require('./posts/comments/replies');
const postCommentReplyReportsRouter = require('./posts/comments/replies/reports');
const postCommentReportsRouter = require('./posts/comments/reports');
const postCommentVotesRouter = require('./posts/comments/votes');
const postReportsRouter = require('./posts/reports');
const postVotesRouter = require('./posts/votes');

const router = express.Router({
  mergeParams: true,
});

/*
 * Routes
 */

router.use('/posts/:postId?', postsRouter);
router.use('/posts/:postId/comments/:postCommentId?', postCommentsRouter);
router.use('/posts/:postId/comments/:postCommentId/replies/:postCommentReplyId?', postCommentRepliesRouter);
router.use('/posts/:postId/comments/:postCommentId/replies/:postCommentReplyId/reports/:postCommentReplyReportId?', postCommentReplyReportsRouter);
router.use('/posts/:postId/comments/:postCommentId/reports/:postCommentReportId?', postCommentReportsRouter);
router.use('/posts/:postId/comments/:postCommentId/votes/:postCommentVoteId?', postCommentVotesRouter);
router.use('/posts/:postId?/reports/:postReportId?', postReportsRouter);
router.use('/posts/:postId/votes/:postVoteId?', postVotesRouter);

/*
 * Export
 */

module.exports = router;
