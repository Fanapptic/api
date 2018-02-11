const helpers = require('../../helpers');

module.exports = environment => {
  /*
   * POST
   */

  describe('POST {baseUrl}/posts/{postId}/comments', () => {
    it('200s with created post comment owned by post', done => {
      const fields = {
        content: 'This is a comment on an awesome post!',
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/comments`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.body.should.be.an('object');
          response.body.postId.should.equal('1');
          response.body.networkUserId.should.equal(environment.networkUser.id);
          response.body.content.should.equal(fields.content);
          done();
        });
    });

    helpers.it403sWhenPassedPostIdNotOwnedByAppModule('post', `${environment.appModuleApiBaseUrl}/posts/412/comments`);
    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', `${environment.appModuleApiBaseUrl}/posts/1/comments`);
  });

  /*
   * GET
   */

  describe('GET {baseUrl}/posts/{postId}/comments', () => {
    it('200s with an arrow of post comments owned by post', done => {
      chai.request(server)
        .get(`${environment.appModuleApiBaseUrl}/posts/1/comments`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(postComment => {
            postComment.should.be.an('object');
            postComment.postId.should.equal(1);
          });
          done();
        });
    });

    it ('200s with post comment owned by post when passed post comment id', done => {
      chai.request(server)
        .get(`${environment.appModuleApiBaseUrl}/posts/1/comments/1`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.postId.should.equal(1);
          done();
        });
    });

    helpers.it403sWhenPassedPostIdNotOwnedByAppModule('get', `${environment.appModuleApiBaseUrl}/posts/412/comments`);
  });

  /*
   * DELETE
   */

  describe('DELETE {baseUrl}/posts/{postId}/comments/{postCommentId}', () => {
    it('204s when passed post comment id', done => {
      chai.request(server)
        .delete(`${environment.appModuleApiBaseUrl}/posts/1/comments/1`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('400s when passed invalid post comment id', done => {
      chai.request(server)
        .delete(`${environment.appModuleApiBaseUrl}/posts/1/comments/1231`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it403sWhenPassedPostIdNotOwnedByAppModule('delete', `${environment.appModuleApiBaseUrl}/posts/412/comments`);
    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('delete', `${environment.appModuleApiBaseUrl}/posts/1/comments`);
  });
};
