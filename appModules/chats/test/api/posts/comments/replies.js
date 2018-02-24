const helpers = require('../../../helpers');

module.exports = environment => {
  /*
   * POST
   */

  describe('POST {baseUrl}/posts/{postId}/comments/{postCommentId}/replies', () => {
    it('200s with created post comment reply owned by post comment', done => {
      const fields = {
        content: 'This is a reply to an awesome comment!',
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.postCommentId.should.equal('1');
          response.body.networkUserId.should.equal(environment.networkUser.id);
          response.body.content.should.equal(fields.content);
          done();
        });
    });

    helpers.it403sWhenPassedPostCommentIdNotOwnedByPost('post', `${environment.appModuleApiBaseUrl}/posts/1/comments/241/replies`);
    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', `${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies`);
  });

  /*
   * GET
   */

  describe('GET {baseUrl}/posts/{postId}/comments/{postCommentId}/replies', () => {
    it('200s with an array of post comment replies owned by post comment', done => {
      chai.request(server)
        .get(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(postCommentReply => {
            postCommentReply.should.be.an('object');
            postCommentReply.postCommentId.should.equal(1);
          });
          done();
        });
    });

    it('200s with post comment reply owned by post comment when passed post comment reply id', done => {
      chai.request(server)
        .get(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies/1`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.should.be.an('object');
          response.body.postCommentId.should.equal(1);
          done();
        });
    });

    helpers.it403sWhenPassedPostCommentIdNotOwnedByPost('get', `${environment.appModuleApiBaseUrl}/posts/1/comments/421/replies`);
  });

  /*
   * DELETE
   */

  describe('DELETE {baseUrl}/posts/{postId}/comments/{postCommentId}/replies', () => {
    it('204s when passed post comment reply id', done => {
      chai.request(server)
        .delete(`${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies/1`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('delete', `${environment.appModuleApiBaseUrl}/posts/1/comments/1/replies/1`);
  });
};
