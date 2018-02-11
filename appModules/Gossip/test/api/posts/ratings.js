const helpers = require('../../helpers');

module.exports = environment => {
  /*
   * POST
   */

  describe('POST {baseUrl}/posts/{postId}/ratings', () => {
    let createdPostRating = {};

    it('200s with created post rating owned by post', done => {
      const fields = {
        rating: 1,
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/ratings`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.postId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          response.body.rating.should.equal(fields.rating);
          createdPostRating = response.body;
          done();
        });
    });

    it('200s with an updated post rating when a previous post rating by network user exists', done => {
      const fields = {
        rating: 0,
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/ratings`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(createdPostRating.id);
          response.body.postId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          response.body.rating.should.equal(fields.rating);
          done();
        });
    });

    it('400s when passed a rating that is not 1 or 0', done => {
      const fields = {
        rating: 332,
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/ratings`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it403sWhenPassedPostIdNotOwnedByAppModule('post', `${environment.appModuleApiBaseUrl}/posts/131/ratings`);
    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', `${environment.appModuleApiBaseUrl}/posts/1/ratings`);
  });
};
