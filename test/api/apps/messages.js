const helpers = require('../../helpers');

describe('App Messages', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/messages', () => {
    it('200s with created app message owned by app', done => {
      const fields = {
        appSourceContentId: 1,
        name: 'braydon',
        message: 'testing!',
      };

      chai.request(server)
        .post(`/apps/${appId}/messages`)
        .set('X-App-Access-Token', testApp.accessToken)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appSourceContentId.should.equal(fields.appSourceContentId);
          response.body.name.should.equal(fields.name);
          response.body.message.should.equal(fields.message);
          done();
        });
    });

    helpers.it401sWhenAppAuthorizationIsInvalid('post', `/apps/${appId}/messages`);
    helpers.it401sWhenAppDeviceAuthorizationIsInvalid('post', `/apps/${appId}/messages`);
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/messages', () => {
    it('200s with an array of app message objects owned by app', done => {
      chai.request(server)
        .get(`/apps/${appId}/messages`)
        .set('X-App-Access-Token', testApp.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          done();
        });
    });

    it('200s with an app message object owned by app when passed app message id', done => {
      chai.request(server)
        .get(`/apps/${appId}/messages/1`)
        .set('X-App-Access-Token', testApp.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appSourceContent.should.be.an('object');
          response.body.appId.should.equal(appId);
          done();
        });
    });

    helpers.it401sWhenAppAuthorizationIsInvalid('get', `/apps/${appId}/messages`);
  });
});
