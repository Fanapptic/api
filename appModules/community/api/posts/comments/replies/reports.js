/*
 * Route: /apps/:appId/modules/:appModuleId/api/community/posts/:postId/comments/:postCommentId/replies/:postCommentReplyId/reports/:postCommentReplyReportId?
 */

const PostCommentReplyModel = require('../../../../models/PostCommentReply');
const PostCommentReplyReportModel = require('../../../../models/PostCommentReplyReport');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const postAuthorize = require('../../../../middlewares/posts/authorize');
const postCommentAuthorize = require('../../../../middlewares/posts/comments/authorize');
const postCommentReplyAuthorize = require('../../../../middlewares/posts/comments/replies/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', postAuthorize);
router.post('/', postCommentAuthorize);
router.post('/', postCommentReplyAuthorize);
router.post('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { postCommentReplyId } = request.params;

  let existingPostCommentReplyReport = null;
  let upsertPostCommentReplyReport = null;

  // TODO: This should be done as a transaction
  PostCommentReplyReportModel.find({ where: { postCommentReplyId, networkUserId } }).then(postCommentReplyReport => {
    existingPostCommentReplyReport = postCommentReplyReport;

    return PostCommentReplyReportModel.upsert({ postCommentReplyId, networkUserId });
  }).then(() => {
    return PostCommentReplyReportModel.find({ where: { postCommentReplyId, networkUserId } });
  }).then(postCommentReplyReport => {
    upsertPostCommentReplyReport = postCommentReplyReport;

    let totalReportsIncrement = (!existingPostCommentReplyReport) ? 1 : 0;

    return PostCommentReplyModel.update({
      totalReports: database.literal(`totalReports + ${totalReportsIncrement}`),
    }, {
      where: { id: postCommentReplyId },
    });
  }).then(() => {
    response.success(upsertPostCommentReplyReport);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
