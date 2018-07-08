/*
 * Route /apps/:appPublicId/branding
 */

const AppModel = rootRequire('/models/App');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const { appPublicId } = request.params;

  AppModel.find({ where: { publicId: appPublicId } }).then(app => {
    if (!app) {
      throw new Error('The app does not exist.');
    }

    response.success({
      id: app.id,
      accessToken: app.accessToken,
      name: app.name,
      subtitle: app.subtitle,
      description: app.description,
      icons: app.icons,
      runtimeConfig: app.runtimeConfig,
      appleListingUrl: app.appleListingUrl,
      googleListingUrl: app.googleListingUrl,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
