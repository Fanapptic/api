const helpers = require('../../../helpers');

describe('OAuth YouTube Users', () => {
  /*
   * GET
   */

  describe('POST /oauth/youtube/users', () => {

    // 200 - This needs to be manually tested - we can't generate a code.

    it('400s when not passed code', done => {
      chai.request(server)
        .post('/oauth/youtube/users')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/oauth/youtube/users');
  });
});
