const helpers = require('../../../../helpers');

describe('App Source Content Likes', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/sources/{appSourceId}/contents/{appSourceContentId}/likes', () => {
    it('200s with created app source content like owned by app source content', done => {
      chai.request(server)
        .post(`/apps/${appId}/sources/1/contents/1/likes`)
        .set('X-App-Access-Token', testApp.accessToken)
        .set('X-App-Device-Access-Token', testAppDevice.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          done();
        });
    });

    helpers.it401sWhenAppDeviceAuthorizationIsInvalid('post', `/apps/${appId}/sources/1/contents/1/likes`);
  });
});
