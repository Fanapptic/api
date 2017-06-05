const helpers = require('../helpers');

describe('Modules', () => {
  /*
   * GET
   */

  describe('GET /modules', () => {
    it('200s with an array of module objects', done => {
      chai.request(server)
        .get('/modules')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          done();
        });
    });

    it('200s with module object when passed module name.', done => {
      chai.request(server)
        .get('/modules/feed')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          done();
        });
    });

    it('400s when passed invalid module name.', done => {
      chai.request(server)
        .get('/modules/badnamelol')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('get', '/modules');
  });
});
