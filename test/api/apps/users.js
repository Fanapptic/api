const helpers = require('../../helpers');

describe('App Users', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/users', () => {
    it('200s with created app user object owned by app', done => {
      const fields = {
        platform: 'android',
      };

      chai.request(server)
        .post(`/apps/${appId}/users`)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId + '');
          done();
        });
    });

    it('400s when passed invalid app id', done => {
      chai.request(server)
        .post('/apps/9494949/users')
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid platform', done => {
      const fields = {
        platform: 'windows',
      };

      chai.request(server)
        .post(`/apps/${appId}/users`)
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
    it('200s with array of app user objects owned by app', done => {
      chai.request(server)
        .get(`/apps/${appId}/users`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appUserObject => {
            appUserObject.should.be.an('object');
            appUserObject.appId.should.equal(appId);
          });
          done();
        });
    });

    it('200s with app user object owned by app when passed app user id', done => {
      chai.request(server)
        .get(`/apps/${appId}/users/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          done();
        });
    });

    it('400s when passed invalid app user id', done => {
      chai.request(server)
        .get(`/apps/${appId}/users/1241241`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('get', '/apps/1/users');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/124124/users');
  });
});
