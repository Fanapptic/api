module.exports = environment => {
  /*
   * POST
   */

  describe('POST {baseUrl}/posts', () => {
    it('200s with created post owned by app module with initial upvote', done => {
      const fields = {
        networkUserAttachmentId: environment.networkUserAttachment.id,
        content: 'This is an awesome test post!',
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appModuleId.should.equal(environment.appModule.id + '');
          response.body.networkUserId.should.equal(environment.networkUser.id);
          response.body.content.should.equal(fields.content);
          response.body.loggedInNetworkUserVote.should.equal(1);
          done();
        });
    });

    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', `${environment.appModuleApiBaseUrl}/posts`);
  });

  /*
   * GET
   */

  describe('GET {baseUrl}/posts', () => {
    it('200s with an array of posts owned by app module', done => {
      chai.request(server)
        .get(`${environment.appModuleApiBaseUrl}/posts`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(post => {
            post.should.be.an('object');
            post.appModuleId.should.equal(environment.appModule.id);
          });
          done();
        });
    });

    it('200s with post owned by app module when passed post id', done => {
      chai.request(server)
        .get(`${environment.appModuleApiBaseUrl}/posts/1`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appModuleId.should.equal(environment.appModule.id);
          done();
        });
    });
  });

  /*
   * DELETE
   */

  describe('DELETE {baseUrl}/posts', () => {
    it('204s when passed post id', done => {
      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send({ content: 'this is a test post and stuff test' })
        .then(response => {
          return chai.request(server)
            .delete(`${environment.appModuleApiBaseUrl}/posts/${response.body.id}`)
            .set('X-Network-User-Access-Token', environment.networkUser.accessToken);
        }).then(response => {
          response.should.have.status(204);
          done();
        }).catch(error => {
          throw error;
        });
    });

    it('400s when passed invalid post id', done => {
      chai.request(server)
        .delete(`${environment.appModuleApiBaseUrl}/posts/1421`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('delete', `${environment.appModuleApiBaseUrl}/posts/1`);
  });
};
