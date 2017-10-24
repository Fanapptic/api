/*
 * Route: /apps/:appId?
 */

const fileUpload = require('express-fileupload');
const App = rootRequire('/libs/App');
const AppModel = rootRequire('/models/App');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId } = request.params;

  if (appId) {
    AppModel.find({ where: { id: appId, userId } }).then(app => {
      if (!app) {
        throw new Error('The app does not exist.');
      }

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

router.patch('/', userAuthorize);
router.patch('/', fileUpload());
router.patch('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId } = request.params;

  AppModel.find({ where: { id: appId, userId } }).then(app => {
    if (!app) {
      throw new Error('The app does not exist.');
    }

    app.name = request.body.name || app.name;
    app.displayName = request.body.displayName || app.displayName;
    app.subtitle = request.body.subtitle || app.subtitle;
    app.description = request.body.description || app.description;
    app.keywords = request.body.keywords || app.keywords;
    app.website = request.body.website || app.website;
    app.contentRating = request.body.contentRating || app.contentRating;

    if (request.body.config) {
      app.config = App.mergeImportable(app.config, request.body.config);
    }

    if (request.files && request.files.icon) {
      return app.processIconUploadAndSave(request.files.icon.data);
    } else {
      return app.save();
    }
  }).then(app => {
    response.success(app);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
