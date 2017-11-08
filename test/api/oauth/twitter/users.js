const helpers = require('../../../helpers');

describe('OAuth Twitter Users', () => {
  /*
   * GET
   */

  describe('POST /oauth/twitter/users', () => {

    // 200 - This needs to be manually tested - we can't generate a token & verifier.

    it('400s when not passed token or verifier', done => {
      chai.request(server)
        .post('/oauth/twitter/users')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/oauth/twitter/users');
  });
});
