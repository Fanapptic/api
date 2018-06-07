const helpers = require('../../../helpers');

describe('App Feed Activities', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/feeds/discovery/activities', () => {
    it('200s with created app feed activity', done => {
      const fields = {
        appDeviceSessionId: testAppDeviceSession.id,
        appSourceContentId: 1,
        type: 'view',
      };

      chai.request(server)
        .post(`/apps/${appId}/feeds/discovery/activities`)
        .set('X-App-Access-Token', testApp.accessToken)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .set('X-App-User-Access-Token', testAppUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appId.should.equal(1);
          response.body.appDeviceId.should.equal(testAppDevice.id);
          response.body.appUserId.should.equal(testAppUser.id);
          response.body.appDeviceSessionId.should.equal(fields.appDeviceSessionId);
          response.body.appSourceContentId.should.equal(fields.appSourceContentId);
          response.body.type.should.equal(fields.type);
          done();
        });
    });

    it('400s when passed invalid appDeviceSessionId', done => {
      const fields = {
        appDeviceSessionId: 12412,
        appSourceContentId: 1,
        type: 'view',
      };

      chai.request(server)
        .post(`/apps/${appId}/feeds/discovery/activities`)
        .set('X-App-Access-Token', testApp.accessToken)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .set('X-App-User-Access-Token', testAppUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid appSourceContentId', done => {
      const fields = {
        appDeviceId: testAppDeviceSession.id,
        appSourceContentId: 4212,
        type: 'view',
      };

      chai.request(server)
        .post(`/apps/${appId}/feeds/discovery/activities`)
        .set('X-App-Access-Token', testApp.accessToken)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .set('X-App-User-Access-Token', testAppUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when passed invalid type', done => {
      const fields = {
        appDeviceSessionId: testAppDeviceSession.id,
        appSourceContentId: 1,
        type: 'lolshit',
      };

      chai.request(server)
        .post(`/apps/${appId}/feeds/discovery/activities`)
        .set('X-App-Access-Token', testApp.accessToken)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .set('X-App-User-Access-Token', testAppUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAppAuthorizationIsInvalid('post', `/apps/${appId}/feeds/discovery/activities`);
    helpers.it401sWhenAppDeviceAuthorizationIsInvalid('post', `/apps/${appId}/feeds/discovery/activities`);
  });
});
