const helpers = require('../../helpers');

describe('User Agreements', () => {
  /*
   * POST
   */

  describe('POST /users/{userId}/agreements', () => {
    it('200s with created user agreement object owned by user', done => {
      const fields = {
        agreement: 'release',
      };

      chai.request(server)
        .post(`/users/${testUser.id}/agreements`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.userId.should.equal(testUser.id);
          response.body.agreement.should.equal(fields.agreement);
          done();
        });
    });

    it('400s when passed invalid agreement', done => {
      const fields = {
        agreement: 'loltroll',
      };

      chai.request(server)
        .post(`/users/${testUser.id}/agreements`)
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/users/1/agreements');
  });

  /*
   * GET
   */

  describe('GET /users/{userId}/agreements', () => {
    it('200s with an array of user agreement objects owned by user', done => {
      chai.request(server)
        .get(`/users/${testUser.id}/agreements`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appDeviceObject => {
            appDeviceObject.should.be.an('object');
            appDeviceObject.userId.should.equal(testUser.id);
          });
          done();
        });
    });

    it('200s with user agreement object owned by user when passed user agreement id', done => {
      chai.request(server)
        .get(`/users/${testUser.id}/agreements/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.userId.should.equal(testUser.id);
          done();
        });
    });

    it('400s when passed invalid user agreement id', done => {
      chai.request(server)
        .get(`/users/${testUser.id}/agreements/1241241`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/users/1/agreements');
  });
});
