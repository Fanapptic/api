/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId/reports/:postReportId?
 */

const PostModel = require('../../models/Post');
const PostReportModel = require('../../models/PostReport');
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

  let existingPostReport = null;
  let upsertPostReport = null;

  PostReportModel.find({ where: { postId, networkUserId } }).then(postReport => {
    existingPostReport = postReport;

    return PostReportModel.upsert({ postId, networkUserId });
  }).then(() => {
    return PostReportModel.find({ where: { postId, networkUserId } });
  }).then(postReport => {
    upsertPostReport = postReport;

    const totalReportsIncrement = (!existingPostReport) ? 1 : 0;

    return PostModel.update({
      totalReports: database.literal(`totalReports + ${totalReportsIncrement}`),
    }, {
      where: { id: postId },
    });
  }).then(() => {
    response.success(upsertPostReport);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
