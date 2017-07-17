/*
 * Route: /apps/:appId/users/:appUserId?
 */

const AppUserModel = rootRequire('/models/AppUser');
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
  const { appId, appUserId } = request.params;

  if (appUserId) {
    AppUserModel.find({ where: { id: appUserId, appId } }).then(appUser => {
      if (!appUser) {
        throw new Error('The app user does not exist.');
      }

      response.success(appUser);
    }).catch(next);
  } else {
    AppUserModel.findAll({ where: { appId } }).then(appUsers => {
      response.success(appUsers);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const { platform } = request.body;

  AppUserModel.create({ appId, platform }).then(appUser => {
    response.success(appUser);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
