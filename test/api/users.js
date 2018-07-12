const helpers = require('../helpers');

let scopedUser = {
  email: 'aTestEmail@fanapptic.com',
  password: 'aTestPassword',
  publisherName: 'tester test',
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
          response.body.publisherName.should.equal(scopedUser.publisherName);
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
        publisherName: 'other names',
        appleEmail: 'me@braydonb.com',
        applePassword: 'testPassword',
        appleTeamId: '7G6A3SWDG83',
        appleTeamName: 'Braydon Batungbacal',
        googleEmail: 'me@braydonb.com',
        googlePassword: 'testing',
        googleServiceAccount: { // just a generic google service account, not related to tests.
          type: 'service_account',
          project_id: 'api-4763755230702910538-543799',
          private_key_id: '209298c57d9e41252b5ee637724eda4154fc001c',
          private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDddN9FOTCFVs4/\nVAbR00vT+lDX6iSIk96787XyoArIcagdwh/XRe8kAL7ypwot0Bn0KpYq4REMKA0/\nbKdrwl6zPjLe1f0P9877J4E8/Ok7g0kcYuQJDQxO1s+67kS98AH38yy3jQJ4rA/y\n0dOhSY4xL6Wq7TJmRhwYXOrIC1fb1q2JTRijj/zbxIMt3VWqaP+30TrQMMpQjm06\nv3tAEUK2tJ/mfVXNlCSMF0r/JYO9R0KHZvGxmyNOahwOgAiymPFIjqVmU1aAueKP\nG7N8HDjjr06py3Ir2MRCDllCSMdB4SwrlsvqKUzuKhrFVlthStiH3rHpXZA+f4Bi\nUZI1xkkLAgMBAAECggEAGMOHbgW5o8dzs8gxJQiEO7WLkcFoiW9Dom/bwkBcRFLV\nUlKRXfC/j56Xu6mrLTlOlaundC8LyXi3FocPZ7DqBxAm/x0ducnjttkRjiDX8eQ5\n6jcyucJgRHan7wbS4Ax1I+Vo9DOL+bN/6w7EpA4GHQDvfSAeGSqw3JaTWIBQOFBh\na+S76x25fJvD+RZjiQC+L3aUyfLAKTdq+e9MlRi6p8W1dyqM34K+QF/zEW0JQB3A\nk5bltlWjXu5PQRpuxUQHHECon0TJ5aASdmTVk6pzgaIbzxLFfcO4SC+b6DSc+k0/\n6oVzs1XilbOozGgTUsS4r5+KvECTqk8+QYlgSpa7wQKBgQD8GI82JE3hMHtGkkZ9\nFKpHSabo5r4N9P6UdMy3q3DrKy1iczX+/oOOW9rwg84hGCJdUGSeSlpCR4s5L9Tx\n7AFhvXhukkujErjGDtO+FIUC2jjDB4QIcf+stYYhWeDKZwX4FELIQ0fdPE6gPiFS\nT4y/fm4L7Sd24a3nds+J8KpwywKBgQDg4teRAXZzRGb2DM8eDR2kUdfw9PCBSeIs\nzr3XWxUPD5OQEbH8R7dcY50m/wgiu0GM6Xppb/lmll2PoS5nN6yhDU3mfKaIDAnO\nbdOZy5C+HLBuEzG3x9BApl5C/OAuxp9kYBQz+G04To3k9sjlIS5WFg9eDLkq0Kye\nkbXXty3AwQKBgEwk0uTklE1nSmTne7j+C+yaV3rTbyZiEJ8gpFD5zJKLqRqqd+28\nTFosbnXlKdafJooO5UVWaerJF0k/pE8qHMS76Otk7smjtwHDqrsoEYDqDukBlSTD\n4hj1fz0Fm7sm4QusevtoLwWo2IrYGVJ2SqnwcybRC/GBeviFz2v3sFN/AoGAJRjm\njJIcMxmWjoJAbGmneSLTJ3mQbxN8Dv4vzOXGjIx6QCrbHI3MDp6UHwm1Et2nC5K8\nUcZZ8vVdC8N//yDtBkhGkH4BjrHFsFrnrBgrkWD0LcRW0EVS8kc/h3dll/HF+23q\nB0S057P1rk6Th1C47xSGhna83XY8849/2szp7EECgYEAzPFz6cqj26p3U19oo+s2\nKkeRJ4fza69QsFO6GthZAPyp/2wb4MaMs7hnretOyslcl0O/B4hgskTx4hByqcS4\nPyaEe6ud1EYqwIOJ279DcWkU5oKjvtYoCMVFBdt5xu+FtDIrDHVy6cxOWem22oJV\nGPH54nHILP7mw4PFlLuiP40=\n-----END PRIVATE KEY-----\n',
          client_email: 'testing@api-4763755230702910538-543799.iam.gserviceaccount.com',
          client_id: '109975124562492192553',
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://accounts.google.com/o/oauth2/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/testing%40api-4763755230702910538-543799.iam.gserviceaccount.com',
        },
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
          response.body.publisherName.should.equal(fields.publisherName);
          response.body.appleEmail.should.equal(fields.appleEmail);
          response.body.appleTeamId.should.equal(fields.appleTeamId);
          response.body.appleTeamName.should.equal(fields.appleTeamName);
          response.body.googleEmail.should.equal(fields.googleEmail);
          response.body.googleServiceAccount.should.deep.equal(fields.googleServiceAccount);
          response.body.should.not.have.property('applePassword');
          response.body.should.not.have.property('googlePassword');
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
