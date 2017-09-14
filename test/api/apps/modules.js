const helpers = require('../../helpers');

describe('App Modules', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/modules', () => {
    const fields = {
      moduleName: 'feed',
      moduleConfig: {
        navigator: {
          navigationOptions: {
            title: 'Feed',
          },
        },
        tab: {
          title: 'Feed',
          icon: {
            name: 'ion-icons',
            set: 'feed',
          },
        },
        dataSources: {
          youtube: {
            authorization: 'abcdefegaw',
          },
        },
      },
      position: 0,
    };

    it('200s with created app module object owned by app', done => {
      chai.request(server)
        .post(`/apps/${appId}/modules`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId + '');
          response.body.moduleName.should.equal(fields.moduleName);
          response.body.moduleConfig.navigator.should.deep.equal(fields.moduleConfig.navigator);
          response.body.moduleConfig.tab.should.deep.equal(fields.moduleConfig.tab);
          response.body.moduleConfig.dataSources.should.deep.include(fields.moduleConfig.dataSources);
          response.body.position.should.equal(fields.position);
          done();
        });
    });

    it('400s when creating another module that passes the total modules limit', done => {
      let promises = [];

      // module limit in /config/app.js is 5.
      // The previous POST test counts for 1.
      // This loop adds 4 more modules.
      // The 6th should fail.

      for (let i = 0; i < 3; i++) {
        promises.push(
          chai.request(server)
            .post(`/apps/${appId}/modules`)
            .set('X-Access-Token', testUser.accessToken)
            .send(fields)
        );
      }

      Promise.all(promises).then(() => {
        chai.request(server)
          .post(`/apps/${appId}/modules`)
          .set('X-Access-Token', testUser.accessToken)
          .send(fields)
          .end((error, response) => {
            response.should.have.status(400);
            done();
          });
      });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/apps/1/modules');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('post', '/apps/1241/modules');
  });

  /*
   * PATCH
   */

  describe('PATCH /apps/{appId}/modules', () => {
    it('200s with updated module object owned by app and ignores properties not in config schema when passed config', done => {
      const fields = {
        moduleName: 'shouldnotchange',
        moduleConfig: {
          navigator: {
            navigationOptions: {
              title: 'Feed Yo',
            },
          },
          tab: {
            title: 'Muh Cool Feed',
            icon: {
              name: 'fontawesome',
              set: 'rocket',
            },
          },
          pointlessConfig: {
            someIgnoredItem: true,
          },
        },
        position: 3,
      };

      chai.request(server)
        .patch(`/apps/${appId}/modules/1`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          response.body.moduleName.should.not.equal(fields.moduleName);
          response.body.moduleConfig.navigator.should.deep.equal(fields.moduleConfig.navigator);
          response.body.moduleConfig.tab.should.deep.equal(fields.moduleConfig.tab);
          response.body.moduleConfig.dataSources.should.be.an('object');
          response.body.moduleConfig.should.not.have.property('pointlessConfig');
          response.body.position.should.equal(fields.position);
          done();
        });
    });

    it('400s when passed invalid app module id', done => {
      chai.request(server)
        .patch(`/apps/${appId}/modules/124421`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/apps/1/modules');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('patch', '/apps/1241/modules');
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/modules', () => {
    it('200s with an array of app module objects owned by app', done => {
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

    it('200s with app module object owned by app when passed app module id', done => {
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

    it('400s when passed invalid app module id', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/2412412`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps/1/modules');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1241/modules');
  });

  /*
   * DELETE
   */

  describe('DELETE /apps/{appId}/modules', () => {
    it('200s with a 200 response code when passed app module id', done => {
      chai.request(server)
        .delete(`/apps/${appId}/modules/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('400s when passed invalid app module id', done => {
      chai.request(server)
        .delete(`/apps/${appId}/modules/412412`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });
});
