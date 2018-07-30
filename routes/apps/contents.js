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
  const { files } = request;

  if (!files || !files.file) {
    throw new Error('File must be provided.');
  }

  awsHelpers.uploadBufferToS3(files.file.name, files.file.data).then(url => {
    response.success({
      url,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
