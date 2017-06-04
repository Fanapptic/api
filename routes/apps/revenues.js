/*
 * Route: /apps/:appId/revenues/:appRevenueId?
 */

const AppRevenueModel = rootRequire('/models/AppRevenue');
const authorize = rootRequire('/middlewares/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', authorize);
router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appRevenueId } = request.params;

  if (appRevenueId) {
    AppRevenueModel.find({ where: { id: appRevenueId, appId } }).then(appRevenue => {
      if (!appRevenue) {
        throw new Error('The app revenue does not exist.');
      }

      response.success(appRevenue);
    }).catch(next);
  } else {
    AppRevenueModel.findAll({ where: { appId } }).then(appRevenues => {
      response.success(appRevenues);
    }).catch(next);
  }
});

/*
 * Export
 */

module.exports = router;
