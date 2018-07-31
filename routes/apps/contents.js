/*
 * Route: /apps/:appId/contents
 */

const aws = require('aws-sdk');
const fileUpload = require('express-fileupload');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorizeOwnership = rootRequire('/middlewares/apps/authorizeOwnership');
const awsHelpers = rootRequire('/libs/awsHelpers');
const awsConfig = rootRequire('/config/aws');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', appAuthorizeOwnership);
router.post('/', fileUpload());
router.post('/', (request, response, next) => {
  const { file } = request.files;

  if (!file) {
    throw new Error('File must be provided.');
  }

  if (!['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'video/mov'].includes(file.mimetype)) {
    throw new Error('File must be JPG, PNG, MP4 or MOV format.');
  }

  awsHelpers.uploadBufferToS3(file.name, file.data).then(url => {
    response.success({
      url,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
