const helpers = require('../../helpers');

module.exports = environment => {
  /*
   * POST
   */

  describe('POST {baseUrl}/posts/{postId}/reports', () => {
    let postReport = {};

    it('200s with created post report owned by post and updates total post reports', done => {
      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/reports`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.postId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          postReport = response.body;

          return chai.request(server).get(`${environment.appModuleApiBaseUrl}/posts/1`);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.totalReports.should.equal(1);
          done();
        });
    });

    it('200s with an same post report when a previous post report by network user exists', done => {
      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/reports`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(postReport.id);
          response.body.postId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          done();
        });
    });

    helpers.it403sWhenPassedPostIdNotOwnedByAppModule('post', `${environment.appModuleApiBaseUrl}/posts/131/reports`);
    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', `${environment.appModuleApiBaseUrl}/posts/1/reports`);
  });
};
