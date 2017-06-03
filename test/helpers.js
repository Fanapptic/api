/*
 * Helpers
 */

module.exports. it401sWhenAuthorizationIsInvalid = (route) => {
  it('401s when authorization is invalid', (done) => {
    chai.request(server)
      .patch(route)
      .set('X-Access-Token', 'some bad token')
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};
