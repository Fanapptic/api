/*
 * Route: /apps/:appId/fields
 */

const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorize);
router.get('/', (request, response) => {
  response.success(request.app.generateAppObject());
});

/*
 * Export
 */

module.exports = router;
