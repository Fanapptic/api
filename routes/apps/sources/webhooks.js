/*
 * Route: /apps/:appId/sources/:appSourceId/webhooks
 */

const webhookAuthorize = rootRequire('/middlewares/webhooks/authorize');
const sources = rootRequire('/libs/app/sources');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/',webhookAuthorize);
router.get('/', (request, response) => {
  const { type } = request.query;
  const mode = request.query['hub.mode'];
  const challenge = request.query['hub.challenge'];
  const verifyToken = request.query['hub.verify_token'];

  if (!type) {
    throw new Error('type must be provided.');
  }

  if (!mode || !challenge || !verifyToken) {
    throw new Error('Missing verification arguments.');
  }

  return response.respondRaw(200, challenge);
});

/*
 * POST
 */

router.post('/', webhookAuthorize);
router.post('/', (request,  response) => {
  const { type } = request.query;
  const Source = sources.getSourceClass(type);

  if (!Source) {
    throw new Error('type is invalid.');
  }

  Source.handleWebhookRequest(request);

  response.success();
});

/*
 * Export
 */

module.exports = router;
