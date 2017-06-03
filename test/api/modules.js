const helpers = require('../helpers');

describe('Modules', () => {
  /*
   * GET
   */

  describe('GET /modules', () => {
    it('200s with an array of module objects', (done) => {
      chai.request(server)
        .get('/modules')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);

          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('/modules');
  });
});
