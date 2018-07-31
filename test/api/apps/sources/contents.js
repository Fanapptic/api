const helpers = require('../../../helpers');

describe('App Source Contents', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/sources/{appSourceId}/contents', () => {
    it('200s with created app source content owny by app source', done => {
      const fields = {
        mediaUrl: 'https://testing-fanapptic-apps.s3.us-west-2.amazonaws.com/com.fanapptic.f498bce70944a11e8a15f5f3643952943/Icon-48x48.png',
        title: 'A title',
        description: 'a description',
      };

      chai.request(server)
        .post(`/apps/${appId}/sources/1/contents`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.image.should.be.an('object');
          response.body.title.should.equal(fields.title);
          response.body.description.should.equal(fields.description);
          done();
        });
    });

    helpers.it401sWhenAppAuthorizationIsInvalid('post', `/apps/${appId}/sources/1/contents`);
  });
});
