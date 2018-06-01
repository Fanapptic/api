/*
 * Route /apps/:appId/feed
 */

const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appDeviceAuthorize = rootRequire('/middlewares/apps/devices/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appAuthorize);
router.get('/', appDeviceAuthorize);
router.get('/', (request, response, next) => {

});

/*
 * Export
 */

module.exports = router;
