const fs = require('fs');
const helpers = require('../../../helpers');

describe('Network User Media', () => {
  /*
   * POST
   */

  describe('POST /networks/fanapptic/users/{networkUserId}/media', () => {
    it('200s with created network user media object owned by network user when passed image', done => {
      chai.request(server)
        .post('/networks/fanapptic/users/1/media')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .attach('media', fs.readFileSync('./test/icon.png'), 'media.png')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.url.should.be.a('string');
          response.body.contentType.should.equal('image/png');
          done();
        });
    });

    it('200s with created network user media object owned by network user when passed video', done => {
      chai.request(server)
        .post('/networks/fanapptic/users/1/media')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .attach('media', fs.readFileSync('./test/video.mp4'), 'media.mp4')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.url.should.be.a('string');
          response.body.contentType.should.equal('video/mp4');
          done();
        });
    });

    it('400s when not passed media file', done => {
      chai.request(server)
        .post('/networks/fanapptic/users/1/media')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', '/networks/fanapptic/users/1/media');
  });

  /*
   * GET
   */

  describe('GET /networks/fanapptic/users/{networkUserId}/media', () => {
    it('200s with an array of network user media owned by network user', done => {
      chai.request(server)
        .get('/networks/fanapptic/users/1/media')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(networkUserMediaObject => {
            networkUserMediaObject.should.be.an('object');
            networkUserMediaObject.networkUserId.should.equal(testNetworkUser.id);
          });
          done();
        });
    });

    it('200s with network user media object owned by network user when passed network user media id', done => {
      chai.request(server)
        .get('/networks/fanapptic/users/1/media/1')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.networkUserId.should.equal(testNetworkUser.id);
          done();
        });
    });

    helpers.it401sWhenNetworkUserAuthorizationIsInvalid('get', '/networks/fanapptic/users/1/media');
  });
});
