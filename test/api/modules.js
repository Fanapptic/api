describe('Modules', () => {
  /*
   * GET
   */

  describe('GET /modules', () => {
    it('200s with an array of module objects.', (done) => {
      chai.request(server)
        .get('/modules')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);

          done();
        });
    });

    it('401s when authorization is invalid', (done) => {
      chai.request(server)
        .get('/modules')
        .set('X-Access-Token', 'some bad token')
        .end((error, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });
});
