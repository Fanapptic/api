const helpers = require('../../../helpers');

module.exports = environment => {
  /*
   * POST
   */

  describe('POST {baseUrl}/posts/{postId}/comments/{postCommentId}/reports', () => {
    let postCommentReport = {};

    it('200s with created post comment report owned by post comment and updates total post comment reports', done => {
      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/reports`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.postCommentId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          postCommentReport = response.body;

          return chai.request(server).get(`${environment.appModuleApiBaseUrl}/posts/1/comments/1`);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.totalReports.should.equal(1);
          done();
        });
    });

    it('200s with an same post comment report when a previous post comment report by network user exists', done => {
      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/reports`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(postCommentReport.id);
          response.body.postCommentId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          done();
        });
    });

    helpers.it403sWhenPassedPostIdNotOwnedByAppModule('post', `${environment.appModuleApiBaseUrl}/posts/412/comments/1/reports`);
    helpers.it403sWhenPassedPostCommentIdNotOwnedByPost('post', `${environment.appModuleApiBaseUrl}/posts/1/comments/131/reports`);
    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', `${environment.appModuleApiBaseUrl}/posts/1/comments/1/reports`);
  });
};
