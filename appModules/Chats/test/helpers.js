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
