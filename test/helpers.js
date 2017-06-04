/*
 * Helpers
 */

module.exports.it401sWhenAuthorizationIsInvalid = (method, route) => {
  it('401s when authorization is invalid', (done) => {
    chai.request(server)[method](route)
      .set('X-Access-Token', 'some bad token')
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};

module.exports.it401sWhenPassedAppIdNotOwnedByUser = (method, route) => {
  it('401s when passed app id now owned by user', (done) => {
    chai.request(server)[method](route)
      .set('X-Access-Token', testUser.accessToken)
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};
