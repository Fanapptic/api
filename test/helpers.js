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

module.exports.it401sWhenAppAuthorizationIsInvalid = (method, route) => {
  it('401s when app authorization is invalid', done => {
    chai.request(server)[method](route)
      .set('X-App-Access-Token', 'bad token')
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};

module.exports.it401sWhenAppDeviceAuthorizationIsInvalid = (method, route) => {
  it('401s when app device authorization is invalid', done => {
    chai.request(server)[method](route)
      .set('X-App-Device-Access-Token', 'some bad token')
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

module.exports.it401sWhenPassedInvalidWebhookToken = (method, route) => {
  it('401s when passed invalid webhook token', done => {
    chai.request(server)[method](route)
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};
