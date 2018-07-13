const helpers = require('../../helpers');

describe('App Sources', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/sources', () => {
    const scopedAppSource = {
      type: 'instagram',
      avatarUrl: 'https://scontent.cdninstagram.com/vp/40442df2e25460dc634c938ed525f039/5BD136E5/t51.2885-19/s150x150/23161741_371295803327277_1672749771627954176_n.jpg',
      accountId: '6323900411',
      accountName: 'fanapptic',
      accountUrl: 'https://www.instagram.com/fanapptic',
      accessToken: '6323900411.ccb2f19.3f6a8a2e759e47bfb70cd7ab25032f24',
      accessTokenSecret: null,
      refreshToken: null,
    };

    it('200s with created app source object owned by app', done => {
      chai.request(server)
        .post(`/apps/${appId}/sources`)
        .set('X-Access-Token', testUser.accessToken)
        .send(scopedAppSource)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal('1');
          response.body.type.should.equal(scopedAppSource.type);
          response.body.avatarUrl.should.equal(scopedAppSource.avatarUrl);
          response.body.accountId.should.equal(scopedAppSource.accountId);
          response.body.accountName.should.equal(scopedAppSource.accountName);
          response.body.accountUrl.should.equal(scopedAppSource.accountUrl);
          response.body.accessToken.should.equal(scopedAppSource.accessToken);
          done();
        });
    });

    it('400s when connecting already connected app source', done => {
      chai.request(server)
        .post(`/apps/${appId}/sources`)
        .set('X-Access-Token', testUser.accessToken)
        .send(scopedAppSource)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid type', done => {
      const invalidFields = Object.assign({}, scopedAppSource, {
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
      const invalidFields = Object.assign({}, scopedAppSource, {
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
          response.body.forEach(appSourceObject => {
            appSourceObject.should.be.an('object');
            appSourceObject.appId.should.equal(1);
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
