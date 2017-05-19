/*
 * Route: /apps/:appId/users/:appUserId?
 */

const App = rootRequire('/models/App');
const AppUser = rootRequire('/models/AppUser');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId, appUserId } = request.params;

  App.userHasPermission(appId, userId).then(() => {
    if (appUserId) {
      return AppUser.find({ where: { id: appUserId, appId } });
    } else {
      return AppUser.findAll({ where: { appId } });
    }
  }).then(result => {
    response.success(result);
  }).catch(next);
});

/*
 * POST
 */

router.post('/', (request, response, next) => {

});

/*
 * Export
 */

module.exports = router;
