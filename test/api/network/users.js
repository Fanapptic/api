/*
 * Route: /networks/fanapptic/users
 */

describe('Network Users', () => {
  /*
   * POST
   */

  describe('POST /networks/fanapptic/users', () => {
    it('200s with created or updated network user', done => {
      const fields = {
        facebookAccessToken: 'EAAFfFpdEd8UBAJU0KZBELCD5zry7kxySSuG8sm8F0aLgB6xdXRjqil9EFnqmtZCFSqIWAGglkmPYFpZCZCs8Bn9KNdXLy6covzFweZCSfymqZAJUtGjor3YE4RDVt4r7qochm3zp78gBUp2ZAXJU950z9RPbOKkUjZCZCZCv0hGbZBCV0Illm9pPvv1',
      };

      chai.request(server)
        .post('/networks/fanapptic/users')
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.facebookAccessToken.should.equal(fields.facebookAccessToken);
          done();
        });
    });

    it('400s when passed invalid facebook access token', done => {
      const fields = {
        facebookAccessToken: 'someBadAccessToken',
      };

      chai.request(server)
        .post('/networks/fanapptic/users')
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  /*
   * GET
   */


});
