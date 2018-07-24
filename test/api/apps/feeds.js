const helpers = require('../../helpers');

describe('App Feeds', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/feeds', () => {
    it('200s with an array of app source content objects owned by app', done => {
      chai.request(server)
        .get(`/apps/${appId}/feeds`)
        .set('X-App-Access-Token', testApp.accessToken)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appSourceContentObject => {
            appSourceContentObject.should.be.an('object');
            appSourceContentObject.appId.should.equal(appId);
          });
          done();
        });
    });

    it('200s with an array of app source content objects owned by app when device access token is omitted', done => {
      chai.request(server)
        .get(`/apps/${appId}/feeds`)
        .set('X-App-Access-Token', testApp.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appSourceContentObject => {
            appSourceContentObject.should.be.an('object');
            appSourceContentObject.appId.should.equal(appId);
          });
          done();
        });
    });

    it('200s with app source content object when passed app source content id', done => {
      chai.request(server)
        .get(`/apps/${appId}/feeds?appSourceContentId=3`)
        .set('X-App-Access-Token', testApp.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          done();
        });
    });

    helpers.it401sWhenAppAuthorizationIsInvalid('get', `/apps/${appId}/feeds`);
    helpers.it401sWhenAppDeviceAuthorizationIsInvalid('get', `/apps/${appId}/feeds`);
  });
});
