/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/comments/:postCommentId/reports/:postCommentReportId?
 */

const PostCommentModel = require('../../../models/PostComment');
const PostCommentReportModel = require('../../../models/PostCommentReport');
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

  let existingPostCommentReport = null;
  let upsertPostCommentReport = null;

  // TODO: This should be done as a transaction
  PostCommentReportModel.find({ where: { postCommentId, networkUserId } }).then(postCommentReport => {
    existingPostCommentReport = postCommentReport;

    return PostCommentReportModel.upsert({ postCommentId, networkUserId });
  }).then(() => {
    return PostCommentReportModel.find({ where: { postCommentId, networkUserId } });
  }).then(postCommentReport => {
    upsertPostCommentReport = postCommentReport;

    let totalReportsIncrement = (!existingPostCommentReport) ? 1 : 0;

    return PostCommentModel.update({
      totalReports: database.literal(`totalReports + ${totalReportsIncrement}`),
    }, {
      where: { id: postCommentId },
    });
  }).then(() => {
    response.success(upsertPostCommentReport);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
