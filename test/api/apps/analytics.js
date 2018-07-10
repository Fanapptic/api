describe('App Analytics', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/analytics', () => {
    it('200s with app analytics object', done => {
      chai.request(server)
        .get('/apps/1/analytics')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          done();
        });
    });
  });
});
