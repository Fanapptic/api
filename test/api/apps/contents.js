const fs = require('fs');
const helpers = require('../../helpers');

describe('App Contents', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/contents', () => {
    it('200s with uploaded content url', done => {
      chai.request(server)
        .post('/apps/1/contents')
        .set('X-Access-Token', testUser.accessToken)
        .attach('file', fs.readFileSync('./test/icon.png'), 'icon.png')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.url.should.be.a('string');
          done();
        });
    });

    helpers.it401sWhenAppAuthorizationIsInvalid('post', `/apps/${appId}/contents`);
  });
});
