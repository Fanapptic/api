const helpers = require('../../helpers');

describe('App Fields', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/fields', () => {
    it('200s with an object containing application fields.', done => {
      chai.request(server)
        .get(`/apps/${appId}/fields`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.an('object');
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('get', '/apps/1/fields');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1241/fields');
  });
});
