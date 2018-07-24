describe('App Users', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/users', () => {
    it('200s with created or updated app user', done => {
      const fields = {
        facebookAccessToken: 'EAABxOp5SDWABANa490f9x52uAqP76eCEeGH7v7hm7iZCjAYuqPlV8Ewp5nmIONISlRpQqom82XrKUIiZBqcDZCVlcCAdnLZBjxf053uW6mdRvalVFnQPiKeMZC1oy1m9NGGMHx5S4US9ySZB0BZCVNOQy4pGiWF0mhTZBmGrsyZCpLkQk7g5pFc7AqykwNyP8yzsZD',
      };

      chai.request(server)
        .post(`/apps/${appId}/users`)
        .set('X-App-Access-Token', testApp.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.facebookAccessToken.should.equal(fields.facebookAccessToken);
          done();
        });
    });

    it('401s when passed invalid app id', done => {
      chai.request(server)
        .post('/apps/9494949/users')
        .set('X-App-Access-Token', testApp.accessToken)
        .end((error, response) => {
          response.should.have.status(401);
          done();
        });
    });

    it('400s when passed invalid facebook access token', done => {
      const fields = {
        facebookAccessToken: 'somebadtoken',
      };

      chai.request(server)
        .post(`/apps/${appId}/users`)
        .set('X-App-Access-Token', testApp.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/users', () => {
    it('200s with app user', done => {
      chai.request(server)
        .get(`/apps/${appId}/users`)
        .set('X-App-User-Access-Token', testAppUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.id.should.equal(testAppUser.id);
          done();
        });
    });
  });
});
