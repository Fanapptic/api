const helpers = require('../../helpers');

describe('User Charges', () => {
  /*
   * POST
   */

  describe('POST /users/{userId}/charges', () => {
    it('200s with created user charge object', done => {
      const fields = {
        source: 'tok_visa',
      };

      chai.request(server)
        .post('/users/1/charges')
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.userId.should.equal(testUser.id);
          response.body.details.should.be.an('object');
          done();
        });
    });

    it('400s when source is invalid', done => {
      const fields = {
        source: 'badsource',
      };

      chai.request(server)
        .post('/users/1/charges')
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/users/1/charges');
  });
});
