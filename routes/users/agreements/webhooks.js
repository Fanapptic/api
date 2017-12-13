/*
 * Route: /users/:userId/agreements/:userAgreementId/webhooks
 */

const multer = require('multer');
const UserAgreementModel = rootRequire('/models/UserAgreement');
const webhookAuthorize = rootRequire('/middlewares/webhooks/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', webhookAuthorize);
router.post('/', multer().none());
router.post('/', (request, response, next) => {
  let data = null;

  try {
    data = JSON.parse(request.body.json);
  } catch(e) {
    // Pass
  }

  if (!data || data.event.event_type !== 'signature_request_downloadable') {
    return response.success('Hello API Event Received');
  }

  const signatureRequestId = data.signature_request.signature_request_id;

  UserAgreementModel.find({ where: { signatureRequestId } }).then(userAgreement => {
    return (userAgreement) ? userAgreement.getSignatureFileAndSave() : true;
  }).then(() => {
    response.success('Hello API Event Received');
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;