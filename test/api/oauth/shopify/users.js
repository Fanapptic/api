const helpers = require('../../../helpers');

describe('OAuth Shopify Users', () => {
  /*
   * POST
   */

  // 200 - This needs to be manually tested - we can't generate a code & shop.

  it('400s when not passed token or shop', done => {
    chai.request(server)
      .post('/oauth/shopify/users')
      .set('X-Access-Token', testUser.accessToken)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  helpers.it401sWhenUserAuthorizationIsInvalid('post', '/oauth/shopify/users');
});
