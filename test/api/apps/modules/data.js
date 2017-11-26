const helpers = require('../../../helpers');

describe('App Module Data', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/modules/{appModuleId}/data', () => {
    it('200s with an array of a maximum of 20 app module data objects in descending publishedAt order owned by app module', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/data`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.length.should.be.within(0, 20);
          response.body.reduce((lastTimestamp, appModuleDataObject) => {
            const timestamp = Date.parse(appModuleDataObject.publishedAt);

            appModuleDataObject.should.be.an('object');
            appModuleDataObject.appModuleId.should.equal(1);
            appModuleDataObject.appModuleProviderId.should.equal(1);

            if (lastTimestamp) {
              timestamp.should.be.below(lastTimestamp);
            }

            return timestamp;
          }, 0);
          done();
        });
    });

    it('200s with an array of app module data objects older than maxPublishedAt owned by app module', done => {
      const maxPublishedAt = '2016-03-06T20:19:16.000Z';

      chai.request(server)
        .get(`/apps/${appId}/modules/1/data?maxPublishedAt=${maxPublishedAt}`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          Date.parse(response.body[0].publishedAt).should.be.below(Date.parse(maxPublishedAt));
          done();
        });
    });

    it('200s with app module data object owned by app module when passed app module data id', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/data/1`)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appModuleId.should.equal(1);
          response.body.appModuleProviderId.should.equal(1);
          response.body.data.should.be.an('object');
          done();
        });
    });

    it('400s when passed invalid app module data id', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/data/42141`)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it403sWhenPassedAppModuleIdNotOwnedByApp('get', '/apps/1/modules/1421/data');
  });
});
