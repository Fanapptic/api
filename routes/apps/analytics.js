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
      weekly: '12,631',
      total: '182,513',
    },
    activeUsers: {
      daily: '23,631',
      weekly: '74,421',
    },
    usage: {
      daily: '67,421',
      total: '361,214',
    },
    adRevenue: {
      daily: '$1,741.42',
      monthly: '$34,631.53',
    },
  });
});

/*
 * Export
 */

module.exports = router;
