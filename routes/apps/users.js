/*
 * Route: /apps/:appId/users/:appUserId?
 */

const App = rootRequire('/models/App');
const AppUser = rootRequire('/models/AppUser');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appUserId } = request.params;

  if (appUserId) {
    AppUser.find({ where: { id: appUserId, appId } }).then(result => {
      response.success(result);
    }).catch(next);
  } else {
    AppUser.findAll({ where: { appId } }).then(result => {
      response.success(result);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', (request, response, next) => {
  const { appId } = request.params;

  AppUser.create({ appId }).then(appUser => {
    response.success(appUser);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
