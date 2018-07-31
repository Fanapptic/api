describe('App Users', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/users', () => {
    it('200s with created or updated app user', done => {
      const fields = {
        facebookAccessToken: 'EAABxOp5SDWABAOXhyLOVUHZAhBhqhkGoFuU5MSEsuxfIgzbYATlM0IC6HN4LYxStDSLjpCfJqkUSVdE3tMc8D3lRmGbsZBt29REZAI3aVaYPDJEV3Gj8CK9wVZCj497siR9uReIHJUdZCceuw1fm01MUv7GruMKHs8g26LOHJQUDBMqtC1nMv0ZBPO9V3PCYoZD',
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
