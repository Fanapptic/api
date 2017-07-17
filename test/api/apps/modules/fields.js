const helpers = require('../../../helpers');

describe('App Module Fields', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/modules/{appModuleId}/fields', () => {
    it('200s with an object containing module fields.', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/fields`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.an('object');
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/apps/1/modules/1/fields');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1/modules/1251/fields');
    helpers.it403sWhenPassedAppModuleIdNotOwnedByApp('get', '/apps/1/modules/4124/fields');
  });
});
