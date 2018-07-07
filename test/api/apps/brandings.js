describe('App Brandings', () => {
  /*
   * GET
   */

  describe('GET /apps/{appPublicId}/brandings', () => {
    it('200s with app branding object when passed app public id', done => {
      chai.request(server)
        .get(`/apps/${testApp.publicId}/brandings`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          done();
        });
    });

    it('400s when app public id is invalid', done => {
      chai.request(server)
        .get('/apps/41241/brandings')
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });
});
