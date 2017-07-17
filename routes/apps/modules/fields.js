/*
 * Route: /apps/:appId/modules/:appModuleId/fields
 */

const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appModuleAuthorize = rootRequire('/middlewares/apps/modules/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorize);
router.get('/', appModuleAuthorize);
router.get('/', (request, response) => {
  response.success(request.appModule.generateModuleObject());
});

/*
 * Export
 */

module.exports = router;
