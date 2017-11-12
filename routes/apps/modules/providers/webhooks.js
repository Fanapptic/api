/*
 * Route: /apps/:appId/modules/:appModuleId/providers/:appModuleProviderId/webhooks
 */

const webhookAuthorize = rootRequire('/middlewares/webhooks/authorize');
const appModules = rootRequire('/appModules');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', webhookAuthorize);
router.get('/', (request, response) => {
  const { dataSource } = request.query;
  const mode = request.query['hub.mode'];
  const challenge = request.query['hub.challenge'];
  const verifyToken = request.query['hub.verify_token'];

  if (!dataSource) {
    throw new Error('dataSource must be provided.');
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
router.post('/', (request, response) => {
  const { dataSource } = request.query;
  const { moduleClasses } = appModules;
  let validDataSource = false;

  Object.keys(moduleClasses).forEach(moduleName => {
    const module = new moduleClasses[moduleName]();
    const dataSourceInstance = module.getDataSource(dataSource);

    if (dataSourceInstance) {
      validDataSource = true;
      dataSourceInstance.handleWebhookRequest(request);
    }
  });

  if (!validDataSource) {
    throw new Error('dataSource is invalid.');
  }

  response.success();
});

/*
 * Export
 */

module.exports = router;
