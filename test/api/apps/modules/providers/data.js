const helpers = require('../../../../helpers');

describe('App Module Provider Data', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/modules/{appModuleId}/providers/{appModuleProviderId}/data', () => {
    it('200s with an array of a maximum of 5 app module provider data objects in descending publishedAt order owned by app module provider', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/providers/${testAppModuleProvider.id}/data`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.length.should.be.within(0, 5);
          response.body.reduce((lastTimestamp, appModuleProviderDataObject) => {
            const timestamp = Date.parse(appModuleProviderDataObject.publishedAt);

            appModuleProviderDataObject.should.be.an('object');
            appModuleProviderDataObject.appModuleProviderId.should.equal(1);

            if (lastTimestamp) {
              timestamp.should.be.below(lastTimestamp);
            }

            return timestamp;
          }, 0);
          done();
        });
    });

    it('200s with an array of app module provider data objects older than maxPublishedAt owned by app module provider', done => {
      const maxPublishedAt = '2016-03-06T20:19:16.000Z';

      chai.request(server)
        .get(`/apps/${appId}/modules/1/providers/${testAppModuleProvider.id}/data?maxPublishedAt=2016-03-06T20:19:16.000Z`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          Date.parse(response.body[0].publishedAt).should.be.below(Date.parse(maxPublishedAt));
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
