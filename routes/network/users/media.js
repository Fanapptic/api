/*
 * Route: /networks/fanapptic/users/:networkUserId/media/:networkUserMediaId?
 */

const aws = require('aws-sdk');
const fileUpload = require('express-fileupload');
const fileType = require('file-type');
const uuidV1 = require('uuid/v1');
const NetworkUserMediaModel = rootRequire('/models/NetworkUserMedia');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const awsConfig = rootRequire('/config/aws');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', networkUserAuthorize);
router.get('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { networkUserMediaId } = request.params;

  if (networkUserMediaId) {
    NetworkUserMediaModel.find({ where: { id: networkUserMediaId, networkUserId } }).then(networkUserMedia => {
      if (!networkUserMedia) {
        throw new Error('The network user media does not exist.');
      }

      response.success(networkUserMedia);
    }).catch(next);
  } else {
    NetworkUserMediaModel.findAll({ where: { networkUserId } }).then(networkUserMedia => {
      response.success(networkUserMedia);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', fileUpload());
router.post('/', (request, response, next) => {
  if (!request.files || !request.files.media) {
    throw new Error('A media file must be provided.');
  }

  const s3 = new aws.S3();
  const networkUserId = request.networkUser.id;
  const mediaBuffer = request.files.media.data;
  const { ext, mime } = fileType(mediaBuffer);

  s3.upload({
    ACL: 'public-read',
    Body: mediaBuffer,
    Bucket: awsConfig.s3NetworkUsersBucket,
    ContentType: mime,
    Key: `${networkUserId}/${uuidV1()}.${ext}`,
  }).promise().then(result => {
    return NetworkUserMediaModel.create({
      networkUserId,
      url: result.Location,
      contentType: mime,
    });
  }).then(networkUserMedia => {
    response.success(networkUserMedia);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
