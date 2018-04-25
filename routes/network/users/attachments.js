/*
 * Route: /networks/fanapptic/users/:networkUserId/attachments/:networkUserAttachmentId?
 */

const aws = require('aws-sdk');
const fileUpload = require('express-fileupload');
const fileType = require('file-type');
const uuidV1 = require('uuid/v1');
const requestPromise = require('request-promise');
const metascraper = require('metascraper');
const NetworkUserAttachmentModel = rootRequire('/models/NetworkUserAttachment');
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
  const { networkUserAttachmentId } = request.params;

  if (networkUserAttachmentId) {
    NetworkUserAttachmentModel.find({ where: { id: networkUserAttachmentId, networkUserId } }).then(networkUserAttachment => {
      if (!networkUserAttachment) {
        throw new Error('The network user attachment does not exist.');
      }

      response.success(networkUserAttachment);
    }).catch(next);
  } else {
    NetworkUserAttachmentModel.findAll({ where: { networkUserId } }).then(networkUserAttachments => {
      response.success(networkUserAttachments);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', fileUpload());
router.post('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const media = (request.files && request.files.media) ? request.files.media : null;
  let { url } = request.body;
  let contentType = null;
  let previewImageUrl = null;
  let title = null;
  let description = null;

  let promise = null;

  if (!url && !media) {
    throw new Error('A url or media file must be provided.');
  }

  if (url) {
    url = (!url.includes('www.')) ? 'www.' + url : url;
    url = (!url.includes('http')) ? 'http://' + url : url;

    promise = requestPromise.get({
      url,
      transform: (body, response) => ({ body, headers: response.headers}),
    }).then(response => {
      contentType = response.headers['content-type'];

      if (!contentType.includes('html')) {
        return;
      }

      return metascraper({ html: response.body, url }).then(metadata => {
        previewImageUrl = metadata.image;
        title = metadata.title;
        description = metadata.description;
      });
    });
  }

  if (media) {
    const s3 = new aws.S3();
    const { ext, mime } = fileType(media.data);

    contentType = mime;

    promise = s3.upload({
      ACL: 'public-read',
      Body: media.data,
      Bucket: awsConfig.s3NetworkUsersBucket,
      ContentType: contentType,
      Key: `${networkUserId}/${uuidV1()}.${ext}`,
    }).promise().then(result => {
      url = result.Location;
    });
  }

  promise.then(() => {
    return NetworkUserAttachmentModel.create({
      networkUserId,
      contentType,
      url,
      previewImageUrl,
      title,
      description,
    });
  }).then(networkUserAttachment => {
    response.success(networkUserAttachment);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
