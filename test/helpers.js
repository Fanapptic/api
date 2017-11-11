/*
 * Helpers
 */

module.exports.it401sWhenUserAuthorizationIsInvalid = (method, route) => {
  it('401s when user authorization is invalid', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', 'some bad token')
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};

module.exports.it401sWhenInternalAuthorizationIsInvalid = (method, route) => {
  it('401s when internal authorization is invalid', done => {
    chai.request(server)[method](route)
      .set('X-Internal-Token', 'some bad token')
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};

module.exports.it403sWhenPassedAppIdNotOwnedByUser = (method, route) => {
  it('403s when passed app id not owned by user', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', testUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};

module.exports.it403sWhenPassedAppModuleIdNotOwnedByApp = (method, route) => {
  it('403s when passed app module id not owned by app', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', testUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};

module.exports.it403sWhenPassedAppModuleProviderIdNotOwnedByAppModule = (method, route) => {
  it('403s when passed app module provider id not owned by app module', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', testUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};

module.exports.it403sWhenPassedAppDeploymentIdNotOwnedByApp = (method, route) => {
  it('403s when passed app deployment id not owned by app', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', testUser.accessToken)
      .end((error, response) => {
        response.should.have.status(403);
        done();
      });
  });
};
