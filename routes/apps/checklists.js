/*
 * Route: /apps/:appId/checklists
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
router.get('/', (request, response, next) => {
  request.app.generateChecklist().then(checklist => {
    response.success(checklist);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
