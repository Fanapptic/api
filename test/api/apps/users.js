describe('App Users', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/users', () => {
    it('200s with created or updated app user', done => {
      const fields = {
        facebookAccessToken: 'EAABxOp5SDWABAIbvzRnZCeLlx5tleU2OtTT1JfFClPsXW5l5AQhPZAse0shTtiPcFlAjyXDpNQtqPZB5l2NrQAj0Eyqy5e61HmxGDYtLofEFm7l440MCeqa3uknrUA47LO1tUSGAFNx8qulznqyJ22ddhdPzDKZADKKl2D0NSZB7WJxDsJFWCEQ0UQlTgJPgzxNU4Y2iMqwZDZD',
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
