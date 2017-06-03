/*
 * Helpers
 */

module.exports. it401sWhenAuthorizationIsInvalid = (method, route) => {
  it('401s when authorization is invalid', (done) => {
    chai.request(server)[method](route)
      .set('X-Access-Token', 'some bad token')
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};
