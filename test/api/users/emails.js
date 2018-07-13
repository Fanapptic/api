const helpers = require('../../helpers');

describe('User Emails', () => {
  /*
   * GET
   */

  describe('GET /users/{userId}/emails', () => {
    it('200s with an array of user email objects owned by the user', done => {
      chai.request(server)
        .get('/users/1/emails')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(userEmailObject => {
            userEmailObject.should.be.an('object');
            userEmailObject.userId.should.equal(1);
          });
          done();
        });
    });

    it('200s with user email object owned by the user when passed user email id', done => {
      chai.request(server)
        .get('/users/1/emails/1')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.userId.should.equal(1);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/users/1/emails');
  });
});
