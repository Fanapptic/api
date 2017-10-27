/*
 * Route: /apps/:appId/analytics
 */

const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
/*const AppRevenueModel = rootRequire('/models/AppRevenue');
const AppSessionModel = rootRequire('/models/AppSession');
const AppUserModel = rootRequire('/models/AppUser');*/

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  response.success({
    downloads: {
      weekly: 0,
      total: 0,
    },
    activeUsers: {
      daily: 0,
      weekly: 0,
    },
    usage: {
      daily: 0,
      total: 0,
    },
    adRevenue: {
      daily: 0,
      monthly: 0,
    },
  });
});

/*
 * Export
 */

module.exports = router;
