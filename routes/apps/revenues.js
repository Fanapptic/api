/*
 * Route: /apps/:appId/revenues/:appRevenueId?
 */

const AppRevenue = rootRequire('/models/AppRevenue');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appRevenueId } = request.params;

  if (appRevenueId) {
    AppRevenue.find({ where: { id: appRevenueId, appId } }).then(appRevenue => {
      response.success(appRevenue);
    });
  } else {
    AppRevenue.findAll({ where: { appId } }).then(appRevenues => {
      response.success(appRevenues);
    }).catch(next);
  }
});

/*
 * Export
 */

module.exports = router;
