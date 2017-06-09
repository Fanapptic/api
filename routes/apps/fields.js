/*
 * Route: /apps/:appId/fields
 */

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
router.get('/', (request, response) => {
  response.success(request.app.generateAppObject());
});

/*
 * Export
 */

module.exports = router;
