const helpers = require('../../helpers');

describe('User Charges', () => {
  /*
   * POST
   */

  describe('POST /users/{userId}/charges', () => {
    it('200s with created user charge object', done => {
      const fields = {
        source: 'tok_visa',
        amount: 12500,
        description: 'A test charge',
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

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/users/1/charges');
  });
});
