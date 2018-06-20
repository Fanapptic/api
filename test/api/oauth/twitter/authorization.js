const helpers = require('../../../helpers');

describe('OAuth Twitter Authorizations', () => {
  /*
   * GET
   */

  describe('GET /oauth/twitter/authorizations', () => {
    it('200s with authorization object containing authorization url', done => {
      chai.request(server)
        .get('/oauth/twitter/authorizations?redirectUrl=https%3A%2F%2Fwww.manage.fanapptic.com%2Foauth')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.url.should.be.a('string');
          done();
        });
    });

    it('400s when not passed redirectUrl as a query parameter', done => {
      chai.request(server)
        .get('/oauth/twitter/authorizations')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/oauth/twitter/authorizations');
  });
});
