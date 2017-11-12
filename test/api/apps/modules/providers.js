const helpers = require('../../../helpers');

describe('App Module Providers', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/modules/{appModuleId}/providers', () => {
    const fields = {
      dataSource: 'instagram',
      avatarUrl: 'https://scontent.cdninstagram.com/t51.2885-19/11809603_737295259710174_813805448_a.jpg',
      accountId: '417616778',
      accountName: 'braydo25',
      accountUrl: 'https://www.instagram.com/braydo25',
      accessToken: '417616778.20d8092.7c0160e2b09c4f598bb54f2e0274c3fc',
      accessTokenSecret: null,
      refreshToken: null,
    };

    it('200s with created app module provider object owned by app module', done => {
      chai.request(server)
        .post(`/apps/${appId}/modules/1/providers`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appModuleId.should.equal('1');
          response.body.dataSource.should.equal(fields.dataSource);
          response.body.avatarUrl.should.equal(fields.avatarUrl);
          response.body.accountId.should.equal(fields.accountId);
          response.body.accountName.should.equal(fields.accountName);
          response.body.accountUrl.should.equal(fields.accountUrl);
          response.body.accessToken.should.equal(fields.accessToken);
          chai.should().equal(response.body.accessTokenSecret, null);
          chai.should().equal(response.body.refreshToken, null);
          done();
        });
    });

    it('400s when passed invalid data source', done => {
      const invalidFields = Object.assign({}, fields, {
        dataSource: 'badsource',
      });

      chai.request(server)
        .post(`/apps/${appId}/modules/1/providers`)
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
        .post(`/apps/${appId}/modules/1/providers`)
        .set('X-Access-Token', testUser.accessToken)
        .send(invalidFields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/apps/1/modules/1/providers');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('post', '/apps/1/modules/1251/providers');
    helpers.it403sWhenPassedAppModuleIdNotOwnedByApp('post', '/apps/1/modules/4124/providers');
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/modules/{appModuleId}/providers', () => {
    it('200s with an array of app module provider objects owned by app module', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/providers`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appModuleProviderObject => {
            appModuleProviderObject.should.be.an('object');
            appModuleProviderObject.appModuleId.should.equal(1);
          });
          done();
        });
    });

    it('200s with app module provider object owned by app module when passed app module provider id', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/providers/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appModuleId.should.equal(1);
          response.body.dataSource.should.be.a('string');
          done();
        });
    });

    it('400s when passed invalid app module provider id', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/providers/1244121`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps/1/modules/1/providers');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1/modules/1251/providers');
    helpers.it403sWhenPassedAppModuleIdNotOwnedByApp('get', '/apps/1/modules/4124/providers');
  });

  /*
   * DELETE
   */

  describe('DELETE /apps/{appId}/modules/{appModuleId}/providers', () => {
    it('204s when passed app module provider id', done => {
      chai.request(server)
        .delete(`/apps/${appId}/modules/1/providers/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('400s when passed invalid app module provider id', done => {
      chai.request(server)
        .delete(`/apps/${appId}/modules/1/providers/42142`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', '/apps/1/modules/1/providers');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('delete', '/apps/1/modules/1251/providers');
    helpers.it403sWhenPassedAppModuleIdNotOwnedByApp('delete', '/apps/1/modules/4124/providers');
  });
});
