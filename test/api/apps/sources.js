const helpers = require('../../helpers');

describe('App Sources', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/sources', () => {
    const fields = {
      type: 'instagram',
      avatarUrl: 'https://scontent.cdninstagram.com/t51.2885-19/11809603_737295259710174_813805448_a.jpg',
      accountId: '417616778',
      accountName: 'braydo25',
      accountUrl: 'https://www.instagram.com/braydo25',
      accessToken: '417616778.20d8092.7c0160e2b09c4f598bb54f2e0274c3fc',
      accessTokenSecret: null,
      refreshToken: null,
    };

    it('200s with created app source object owned by app', done => {
      chai.request(server)
        .post(`/apps/${appId}/sources`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal('1');
          response.body.type.should.equal(fields.type);
          response.body.avatarUrl.should.equal(fields.avatarUrl);
          response.body.accountId.should.equal(fields.accountId);
          response.body.accountName.should.equal(fields.accountName);
          response.body.accountUrl.should.equal(fields.accountUrl);
          response.body.accessToken.should.equal(fields.accessToken);
          done();
        });
    });

    it('400s when passed invalid type', done => {
      const invalidFields = Object.assign({}, fields, {
        type: 'badtype',
      });

      chai.request(server)
        .post(`/apps/${appId}/sources`)
        .set('X-Access-Token', testUser.accessToken)
        .send(invalidFields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid access token', done => {
      const invalidFields = Object.assign({}, fields, {
        accessToken: 'badtoken',
      });

      chai.request(server)
        .post(`/apps/${appId}/sources`)
        .set('X-Access-Token', testUser.accessToken)
        .send(invalidFields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/apps/1/sources');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('post', '/apps/1321/sources');
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/sources', () => {
    it('200s with an array of app source objects owned by the app', done => {
      chai.request(server)
        .get(`/apps/${appId}/sources`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appModuleProviderObject => {
            appModuleProviderObject.should.be.an('object');
            appModuleProviderObject.appId.should.equal(1);
          });
          done();
        });
    });

    it('200s with app source object owned by app when passed app source id', done => {
      chai.request(server)
        .get(`/apps/${appId}/sources/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(1);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps/1/sources');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1321/sources');
  });

  /*
   * DELETE
   */

  describe('DELETE /apps/{appId}/sources', () => {
    it('204s when passed app source id', done => {
      chai.request(server)
        .delete(`/apps/${appId}/sources/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('400s when passed invalid app source id', done => {
      chai.request(server)
        .delete(`/apps/${appId}/sources/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', '/apps/1/sources');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('delete', '/apps/1321/sources');
  });
});
