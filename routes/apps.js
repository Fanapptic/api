/*
 * Route: /apps/:appId?
 */

const AppModel = rootRequire('/models/App');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId } = request.params;

  if (appId) {
    AppModel.find({ where: { id: appId, userId } }).then(app => {
      response.success(app);
    }).catch(next);
  } else {
    AppModel.findAll({ where: { userId } }).then(apps => {
      response.success(apps);
    }).catch(next);
  }
});

/*
 * PATCH
 */

router.patch('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId } = request.params;

  AppModel.find({ where: { id: appId, userId } }).then(app => {
    if (!app) {
      throw new Error('The app does not exist.');
    }

    app.name = request.body.name || app.name;
    app.shortDescription = request.body.shortDescription || app.shortDescription;
    app.fullDescription = request.body.fullDescription || app.fullDescription;
    app.keywords = request.body.keywords || app.keywords;
    app.iconUrl = request.body.iconUrl || app.iconUrl;
    app.website = request.body.website || app.website;
    app.contentRating = request.body.contentRating || app.contentRating;
    app.config = request.body.config || app.config;

    return app.save();
  }).then(app => {
    response.success(app);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
