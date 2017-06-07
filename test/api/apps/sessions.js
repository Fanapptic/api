const helpers = require('../../helpers');

describe('App Sessions', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/sessions', () => {
    it('200s with created app session object owned by app', done => {
      const fields = {
        appUserId: testAppUser.id,
      };

      chai.request(server)
        .post(`/apps/${appId}/sessions`)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.be.a('number');
          response.body.appId.should.equal(appId + '');
          response.body.startedAt.should.be.a('string');
          done();
        });
    });

    it('400s when passed invalid app id', done => {
      const fields = {
        appUserId: testAppUser.id,
      };

      chai.request(server)
        .post('/apps/421421/sessions')
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  /*
   * PATCH
   */

  describe('PATCH /apps/{appId}/sessions', () => {
    it('200s with ended app session object', done => {
      chai.request(server)
        .patch(`/apps/${appId}/sessions/1`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.be.a('number');
          response.body.appId.should.equal(appId);
          response.body.startedAt.should.be.a('string');
          response.body.endedAt.should.be.a('string');
          done();
        });
    });

    it('400s when patching ended app session', done => {
      chai.request(server)
        .patch(`/apps/${appId}/sessions/1`)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid app id', done => {
      chai.request(server)
        .patch('/apps/414124/sessions/1')
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid app session id', done => {
      chai.request(server)
        .patch(`/apps/${appId}/sessions/412412`)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/sessions', () => {
    it('200s with an array of app session objects owned by app', done => {
      chai.request(server)
        .get(`/apps/${appId}/sessions`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appSessionObject => {
            appSessionObject.should.be.an('object');
            appSessionObject.appId.should.equal(appId);
          });
          done();
        });
    });

    it('200s with app session object owned by app when passed app session id', done => {
      chai.request(server)
        .get(`/apps/${appId}/sessions/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(appId);
          done();
        });
    });

    it('400s when passed invalid app session id', done => {
      chai.request(server)
        .get(`/apps/${appId}/sessions/4124124`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('get', '/apps/1/sessions');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1241/sessions');
  });
});
