const helpers = require('../../helpers');

module.exports = environment => {
  /*
   * POST
   */

  describe('POST {baseUrl}/posts/{postId}/votes', () => {
    let postVote = {};

    it('200s with created post vote owned by post and updates post up/down votes', done => {
      const fields = {
        vote: 1,
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/votes`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.postId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          response.body.vote.should.equal(fields.vote);
          postVote = response.body;

          return chai.request(server).get(`${environment.appModuleApiBaseUrl}/posts/1`);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.totalUpvotes.should.equal(1);
          response.body.totalDownvotes.should.equal(0);
          done();
        });
    });

    it('200s with an updated post vote when a previous post vote by network user exists and updates post up/down votes', done => {
      const fields = {
        vote: -1,
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/votes`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(postVote.id);
          response.body.postId.should.equal(1);
          response.body.networkUserId.should.equal(environment.networkUser.id);
          response.body.vote.should.equal(fields.vote);

          return chai.request(server).get(`${environment.appModuleApiBaseUrl}/posts/1`);
        }).then(response => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.totalUpvotes.should.equal(0);
          response.body.totalDownvotes.should.equal(1);
          done();
        });
    });

    it('400s when passed a vote that is not 1 or 0', done => {
      const fields = {
        vote: 332,
      };

      chai.request(server)
        .post(`${environment.appModuleApiBaseUrl}/posts/1/votes`)
        .set('X-Network-User-Access-Token', environment.networkUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it403sWhenPassedPostIdNotOwnedByAppModule('post', `${environment.appModuleApiBaseUrl}/posts/131/votes`);
    environment.helpers.it401sWhenNetworkUserAuthorizationIsInvalid('post', `${environment.appModuleApiBaseUrl}/posts/1/votes`);
  });
};
