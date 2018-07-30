/*
 * Route: /apps/:appId/source/:appSourceId/:contents/:appSourceContentId?
 */

const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorizeOwnership = rootRequire('/middlewares/apps/authorizeOwnership');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */


router.post('/', userAuthorize);
router.post('/', appAuthorizeOwnership);
router.post('/', (request, response, next) => {

});

/*
 * Export
 */

module.exports = router;
