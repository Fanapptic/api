/*
 * Route: /oauth/shopify/users
 */

const requestPromise = require('request-promise');
const shopifyConfig = rootRequire('/config/dataSources/shopify');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', (request, response, next) => {
  const { code, shop } = request.body;
  let accessToken = null;

  if (!code || !shop) {
    throw new Error('An oauth code and shopify shop must be provided.');
  }

  requestPromise.post({
    url: shopifyConfig.accessTokensUrl.replace('{shop}', shop),
    form: {
      client_id: shopifyConfig.clientId,
      client_secret: shopifyConfig.clientSecret,
      code,
    },
    json: true,
  }).then(credentials => {
    accessToken = credentials.access_token;

    return requestPromise.get({
      url: shopifyConfig.shopsUrl.replace('{shop}', shop),
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
      json: true,
    });
  }).then(result => {
    const { shop } = result;

    response.success({
      id: shop.id,
      name: shop.name,
      avatarUrl: '/images/modules/shopify/avatar.png', // TODO: No avatarUrl for shopify, not sure what to do here.
      accountUrl: shop.myshopify_domain,
      accessToken,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
