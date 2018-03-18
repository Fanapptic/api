/*
 * Helpers
 */

module.exports.it403sWhenPassedPostIdNotOwnedByAppModule = (method, route) => {
  it('403s when passed post id not owned by app module', done => {
    chai.request(server)[method](route)
      .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};

module.exports.it403sWhenPassedPostCommentIdNotOwnedByPost = (method, route) => {
  it('403s when passed post comment id not owned by post', done => {
    chai.request(server)[method](route)
      .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};

module.exports.it403sWhenPassedPostCommentReplyIdNotOwnedByPostComment = (method, route) => {
  it('403s when passed post comment reply id not owned by post comment', done => {
    chai.request(server)[method](route)
      .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};
