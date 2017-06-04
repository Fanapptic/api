const helpers = require('../../helpers');

describe('App Modules', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/modules', () => {
    it('200s with created app module object owned by app', (done) => {
      const fields = {
          
      };

      chai.request(server)
        .post(`/apps/${appId}/modules`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');

        });
    });

    it('400s when passed invalid config', (done) => {
      done();
    });

    it('400s when creating another module that passes the total modules limit', (done) => {
      done();
    });

    helpers.it401sWhenAuthorizationIsInvalid('post', '/apps/1/modules');
    helpers.it401sWhenPassedAppIdNotOwnedByUser('post', '/apps/1241/modules');
  });

  /*
   * PATCH
   */

  describe('PATCH /apps/{appId}/modules', () => {
    it('200s with updated module object owned by app and ignores properties not in config schema when passed config', (done) => {
      done();
    });

    it('400s when passed invalid config', (done) => {
      done();
    });

    it('400s when passed invalid app module id', (done) => {
      chai.request(server)
        .patch(`/apps/${appId}/modules/124421`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('patch', '/apps/1/modules');
    helpers.it401sWhenPassedAppIdNotOwnedByUser('patch', '/apps/1241/modules');
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/modules', () => {
    it('200s with an array of app module objects owned by app', (done) => {
      chai.request(server)
        .get(`/apps/${appId}/modules`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appModuleObject => {
            appModuleObject.should.be.an('object');
            appModuleObject.appId.should.equal(appId);
          });
          done();
        });
    });

    it('200s with app module object owned by app when passed app module id', (done) => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          response.body.moduleName.should.be.a('string');
          response.body.moduleConfig.should.be.an('object');
          done();
        });
    });

    it('400s when passed invalid app module id', (done) => {
      chai.request(server)
        .get(`/apps/${appId}/modules/2412412`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('get', '/apps/1/modules');
    helpers.it401sWhenPassedAppIdNotOwnedByUser('get', '/apps/1241/modules');
  });

  /*
   * DELETE
   */

  describe('DELETE /apps/{appId}/modules', () => {
    it('200s with a 200 response code when passed app module id', (done) => {
      done();
    });

    it('400s when passed invalid app module id', (done) => {
      chai.request(server)
        .get(`/apps/${appId}/modules/412412`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });
});
