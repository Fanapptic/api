const helpers = require('../../helpers');

describe('App Revenues', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/revenues', () => {
    it('200s with an array of app revenue objects owned by app', done => {
      chai.request(server)
        .get(`/apps/${appId}/revenues`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
//          response.body.length.should.be.at.least(1);
          response.body.forEach(appRevenueObject => {
            appRevenueObject.should.be.an('object');
          });
          done();
        });
    });

//    it('200s with app revenue object owned by app when passed app revenue id', (done) => {
//
//    });

    it('400s when passed invalid app revenue id', done => {
      chai.request(server)
        .get(`/apps/${appId}/revenues/124124`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('get', '/apps/1/revenues');
    helpers.it401sWhenPassedAppIdNotOwnedByUser('get', '/apps/1241/revenues');
  });
});
