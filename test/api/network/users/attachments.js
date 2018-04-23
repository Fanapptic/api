const fs = require('fs');
const helpers = require('../../../helpers');

describe('Network User Attachments', () => {
  /*
   * POST
   */

  describe('POST /networks/fanapptic/users/{networkUserId}/attachments', () => {
    it('200s with created network user attachment object owned by network user when passed image', done => {
      chai.request(server)
        .post('/networks/fanapptic/users/1/attachments')
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

    it('200s with created network user attachment object owned by network user when passed video', done => {
      chai.request(server)
        .post('/networks/fanapptic/users/1/attachments')
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

    it('200s with created network user attachment object owned by network user when passed url', done => {
      const fields = {
        url: 'https://www.youtube.com/watch?v=aLg4AV60uWY',
      };

      chai.request(server)
        .post('/networks/fanapptic/users/1/attachments')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.url.should.be.a('string');
          response.body.contentType.should.be.a('string');
          response.body.previewImageUrl.should.be.a('string');
          response.body.title.should.be.a('string');
          response.body.description.should.be.a('string');
          done();
        });
    });

    it('400s when not passed url or media file', done => {
      chai.request(server)
        .post('/networks/fanapptic/users/1/attachments')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', '/networks/fanapptic/users/1/attachments');
  });

  /*
   * GET
   */

  describe('GET /networks/fanapptic/users/{networkUserId}/attachments', () => {
    it('200s with an array of network user attachments owned by network user', done => {
      chai.request(server)
        .get('/networks/fanapptic/users/1/attachments')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(networkUserAttachmentObject => {
            networkUserAttachmentObject.should.be.an('object');
            networkUserAttachmentObject.networkUserId.should.equal(testNetworkUser.id);
          });
          done();
        });
    });

    it('200s with network user attachment object owned by network user when passed network user attachment id', done => {
      chai.request(server)
        .get('/networks/fanapptic/users/1/attachments/1')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.networkUserId.should.equal(testNetworkUser.id);
          done();
        });
    });

    helpers.it401sWhenNetworkUserAuthorizationIsInvalid('get', '/networks/fanapptic/users/1/attachments');
  });
});
