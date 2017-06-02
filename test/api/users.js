describe('Users', () => {
  /*
   * GET
   */

  describe('GET /users', () => {
    it('200s with authenticated user object.', (done) => {
      chai.request(server)
        .get('/users')
        .auth(testUser.email, testUser.password)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });

    it('400s when authentication is invalid.', (done) => {
      chai.request(server)
        .get('/users')
        .auth('someinvaliduser@test.com', 'somebadpassword')
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  /*
   * POST
   */

  describe('POST /users', () => {
    const fields = {
      email: 'aTestEmail@fanapptic.com',
      password: 'aTestPassword',
      firstName: 'First',
      lastName: 'Last',
      phoneNumber: '+12062415243',
      paypalEmail: 'test@paypal.com',
    };

    it('200s with created user object.', (done) => {
      chai.request(server)
        .post('/users')
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.id.should.be.a('number');
          response.body.accessToken.should.be.a('string');
          response.body.email.should.equal(fields.email);
          response.body.firstName.should.equal(fields.firstName);
          response.body.lastName.should.equal(fields.lastName);
          response.body.phoneNumber.should.equal(fields.phoneNumber);
          response.body.paypalEmail.should.equal(fields.paypalEmail);

          testUser.accessToken = response.body.accessToken;

          done();
        });
    });

    it('400s when email address is in use', (done) => {
      chai.request(server)
        .post('/users')
        .send(fields)
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
    it('200s with updated user object.', (done) => {
      const fields = {
        email: 'aNewEmail@gmail.com',
        password: 'aNewPassword',
        firstName: 'patched first name',
        lastName: 'patched last name',
        phoneNumber: '+12535427314',
        paypalEmail: 'aPaypalEmail@gmail.com',
      };

      chai.request(server)
        .patch('/users')
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.id.should.be.a('number');
          response.body.email.should.equal(fields.email);
          response.body.firstName.should.equal(fields.firstName);
          response.body.lastName.should.equal(fields.lastName);
          response.body.phoneNumber.should.equal(fields.phoneNumber);
          response.body.paypalEmail.should.equal(fields.paypalEmail);

          done();
        });
    });

    it('400s when updated email address is in use.', (done) => {
      // TODO: Write this test.
      done();
    });

    it('401s when authorization is invalid.', (done) => {
      chai.request(server)
        .patch('/users')
        .set('X-Access-Token', 'some bad token')
        .end((error, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });
});
