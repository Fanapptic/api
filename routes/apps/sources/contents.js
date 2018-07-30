/*
 * Route: /apps/:appId/source/:appSourceId/:contents/:appSourceContentId?
 */

const aws = require('aws-sdk');
const fileUpload = require('express-fileupload');
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
router.post('/', fileUpload());
router.post('/', (request, response, next) => {
  const { app, appSource, files } = request;
  const { title, description } = request.body;
  const s3 = new aws.S3();

  let image = null;
  let video = null;
  let collection = null;

  if (!files && !title && !description) {
    throw new Error('Media, a title or description must be provided.');
  }

  //// debug

  console.log(files);

  return response.success();

  //// debug

  AppSourceContentModel.create({
    appId: app.id,
    appSourceId: appSource.id,
    image,
    video,
    collection,
    title,
    description,
  }).then(appSourceContent => {
    app.sendGlobalNotification(appSourceContent.id, null, title, description);

    response.success(appSourceContent);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
