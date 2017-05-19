/*
 * Route: /apps/:appId/sessions/:appSessionId?
 */

const App = rootRequire('/models/App');
const AppSession = rootRequire('/models/AppSession');
const AppUser = rootRequire('/models/AppUser');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appAuthorize);
router.get('/', (request,  response, next) => {
  const { appId, appSessionId } = request.params;

  if (appSessionId) {
    AppSession.find({ where: { id: appSessionId, appId } }).then(result => {
      response.success(result);
    }).catch(next);
  } else {
    AppSession.findAll({ where: { appId } }).then(result => {
      response.success(result);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const { appUserId } = request.body;

  AppUser.find({ where: { id: appUserId, appId } }).then(appUser => {
    if (!appUser) {
      throw new Error('The user provided does not belong to the application provided.');
    }

    return AppSession.create({ appId, appUserId });
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', (request, response, next) => {
  const { appId, appSessionId } = request.params;
  const { appUserId } = request.body;

  AppSession.find({ where: { id: appSessionId, appId, appUserId } }).then(appSession => {
    if (!appSession) {
      throw new Error('app session patch error');
    }

    appSession.duration = 1; // TODO: calculate this

    return appSession.save();
  }).then((appSession) => {
    response.success(appSession);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
