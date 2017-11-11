const helpers = require('../../../../helpers');

describe('App Module Provider Data', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/modules/{appModuleId}/providers/{appModuleProviderId}/data', () => {
    it('200s with an array of app module provider data objects own by app module provider', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/providers/${testAppModuleProvider.id}/data`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appModuleProviderDataObject => {
            appModuleProviderDataObject.should.be.an('object');
            appModuleProviderDataObject.appModuleProviderId.should.equal(1);
          });
          done();
        });
    });

    it('200s with app module provider data object own by app module provider when passed app module provider id', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/providers/${testAppModuleProvider.id}/data/1`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appModuleProviderId.should.equal(1);
          response.body.data.should.be.an('object');
          done();
        });
    });

    it('400s when passed invalid app module provider data id', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/providers/${testAppModuleProvider.id}/data/42141`)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it403sWhenPassedAppModuleIdNotOwnedByApp('get', '/apps/1/modules/1421/providers/1/data');
    helpers.it403sWhenPassedAppModuleProviderIdNotOwnedByAppModule('get', '/apps/1/modules/1/providers/24124/data');
  });
});
