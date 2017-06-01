describe('Health', () => {
  /*
   * GET
   */

  describe('GET /health', () => {
    it('200s with "OK"', (done) => {
      chai.request(server).get('/health').end((error, response) => {
        response.should.have.status(200);
        response.body.should.equal('OK');
        done();
      });
    });
  });
});
