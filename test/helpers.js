/*
 * Helpers
 */

module.exports.it401sWhenAuthorizationIsInvalid = (method, route) => {
  it('401s when authorization is invalid', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', 'some bad token')
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};

module.exports.it403sWhenPassedAppIdNotOwnedByUser = (method, route) => {
  it('403s when passed app id now owned by user', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', testUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};

module.exports.it403sWhenPassedAppModuleIdNotOwnedByApp = (method, route) => {
  it('403 when passed app module id not owned by app', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', testUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};
