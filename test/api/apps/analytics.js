const helpers = require('../../helpers');

describe('App Analytics', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/analytics', () => {
    it('200s with an object containing analytics owned by app', done => {
      chai.request(server)
        .get(`/apps/${appId}/analytics`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.activeUsers.daily.should.be.a('number');
          response.body.activeUsers.weekly.should.be.a('number');
          response.body.adRevenue.daily.should.be.a('number');
          response.body.adRevenue.monthly.should.be.a('number');
          response.body.downloads.weekly.should.be.a('number');
          response.body.downloads.total.should.be.a('number');
          response.body.usage.daily.should.be.a('number');
          response.body.usage.total.should.be.a('number');
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps/1/analytics');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1241/analytics');
  });
});
