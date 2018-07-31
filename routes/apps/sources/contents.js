/*
 * Route: /apps/:appId/source/:appSourceId/:contents/:appSourceContentId?
 */

const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorizeOwnership = rootRequire('/middlewares/apps/authorizeOwnership');
const appSourceAuthorize = rootRequire('/middlewares/apps/sources/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */


router.post('/', userAuthorize);
router.post('/', appAuthorizeOwnership);
router.post('/', appSourceAuthorize);
router.post('/', (request, response, next) => {
  const { app, appSource } = request;
  const { mediaUrl, title, description } = request.body;

  let image = (mediaUrl && (mediaUrl.includes('.png') || mediaUrl.includes('.jpeg') || mediaUrl.includes('.jpg'))) ? {
    url: mediaUrl,
  } : null;

  let video = (mediaUrl && (mediaUrl.includes('.mp4') || mediaUrl.includes('.move'))) ? {
    url: mediaUrl,
  } : null;

  if (!mediaUrl && !title && !description) {
    throw new Error('Media, title or description must be provided.');
  }

  AppSourceContentModel.create({
    appId: app.id,
    appSourceId: appSource.id,
    image,
    video,
    title,
    description,
    data: request.body,
    publishedAt: new Date(),
  }).then(appSourceContent => {
    app.sendGlobalNotification(appSourceContent.id, null, title, description);

    response.success(appSourceContent);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
