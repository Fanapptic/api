const helpers = require('../../../../helpers');

module.exports = environment => {
  /*
   * POST
   */

  describe('POST {baseUrl}/posts/{postId}/comments/{postCommentId}/replies/{postCommentReplyId}/reports', () => {
    let postCommentReplyReport = {};

    it('200s with created post comment reply report owned by post comment reply and updates total post comment reply reports', done => {
      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies/1/reports`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.postCommentReplyId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          postCommentReplyReport = response.body;

          return chai.request(server).get(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies/1`);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.totalReports.should.equal(1);
          done();
        }).catch(err => console.log(err));
    });

    it('200s with an same post comment reply report when a previous post comment reply report by network user exists', done => {
      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies/1/reports`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(postCommentReplyReport.id);
          response.body.postCommentReplyId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          done();
        });
    });

    helpers.it403sWhenPassedPostIdNotOwnedByAppModule('post', `${environment.appModuleApiBaseUrl}/posts/412/comments/1/replies/1/reports`);
    helpers.it403sWhenPassedPostCommentIdNotOwnedByPost('post', `${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies/131/reports`);
    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', `${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies/1/reports`);
  });
};
