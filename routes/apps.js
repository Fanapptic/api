/*
 * Route: /apps/:appId?
 */

const fileUpload = require('express-fileupload');
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
    app.appleCategory = request.body.appleCategory || app.appleCategory;
    app.appleListingUrl = request.body.appleListingUrl || app.appleListingUrl;
    app.googleCategory = request.body.googleCategory || app.googleCategory;
    app.googleListingUrl = request.body.googleListingUrl || app.googleListingUrl;
    app.googleServices = request.body.googleServices || app.googleServices;
    app.apnsSnsArn = request.body.apnsSnsArn || app.apnsSnsArn;
    app.gcmSnsArn = request.body.gcmSnsArn || app.gcmSnsArn;
    app.gcmSenderId = request.body.gcmSenderId || app.gcmSenderId;
    app.runtimeConfig = Object.assign({}, app.runtimeConfig, request.body.runtimeConfig);

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
