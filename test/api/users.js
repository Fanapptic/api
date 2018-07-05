const helpers = require('../helpers');

let scopedUser = {
  email: 'aTestEmail@fanapptic.com',
  password: 'aTestPassword',
  appleEmail: 'test@test.com',
  applePassword: 'testing',
  googleEmail: 'meh@google.com',
  googlePassword: 'moretest',
};

describe('Users', () => {
  /*
   * POST
   */

  describe('POST /users', () => {
    it('200s with created user object', done => {
      chai.request(server)
        .post('/users')
        .send(scopedUser)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.be.a('number');
          response.body.accessToken.should.be.a('string');
          response.body.email.should.equal(scopedUser.email);
          response.body.should.not.have.property('password');

          scopedUser.id = response.body.id;
          scopedUser.accessToken = response.body.accessToken;
          done();
        });
    });

    it('400s when email address is in use', done => {
      chai.request(server)
        .post('/users')
        .send(scopedUser)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  /*
   * PATCH
   */

  describe('PATCH /users', () => {
    it('200s with updated user object', done => {
      const fields = {
        email: 'aNewEmail@gmail.com',
        password: 'aNewPassword',
      };

      chai.request(server)
        .patch('/users')
        .set('X-Access-Token', scopedUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.be.a('number');
          response.body.email.should.equal(fields.email);
          response.body.should.not.have.property('password');
          done();
        });
    });

    it('400s when updated email address is in use', done => {
      chai.request(server)
        .patch('/users')
        .set('X-Access-Token', scopedUser.accessToken)
        .send({ email: testUser.email })
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/users');
  });

  /*
   * GET
   */

  describe('GET /users', () => {
    it('200s with authenticated user object when passed valid basic auth', done => {
      chai.request(server)
        .get('/users')
        .auth(testUser.email, testUser.password)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.not.have.property('password');
          done();
        });
    });

    it('200s with authorized user object when passed valid access token', done => {
      chai.request(server)
        .get('/users')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.not.have.property('password');
          done();
        });
    });

    it('400s when authentication is invalid', done => {
      chai.request(server)
        .get('/users')
        .auth('someinvaliduser@test.com', 'somebadpassword')
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/users');
  });
});
