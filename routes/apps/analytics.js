/*
 * Route: /apps/:appId/analytics
 */

const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorizeOwnership = rootRequire('/middlewares/apps/authorizeOwnership');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorizeOwnership);
router.get('/', (request, response, next) => {
  const { appId } = request.params;
  let promises = [];

  // Response
  Promise.all(promises).then(() => {
    response.success({
      downloads: {
        current30Days: 0,
        total: 0,
      },
      activeUsers: {
        current30Days: 0,
      },
      usage: {
        current30Days: 0,
        total: 0,
      },
      adRevenue: {
        current30Days: 0,
      },
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
