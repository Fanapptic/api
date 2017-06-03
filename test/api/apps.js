const helpers = require('../helpers');

describe('Apps', () => {
  /*
   * GET
   */

  describe('GET /apps', () => {
    it('200s with array of app objects owned by user', (done) => {
      chai.request(server)
        .get('/apps')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          if (error) {
            console.log(testUser);
          }

          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.forEach(appObject => {
            appObject.should.be.a('object');
            appObject.userId.should.equal(testUser.id);
          });
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('/apps');
  });
});
