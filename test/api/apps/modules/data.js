const helpers = require('../../../helpers');

describe('App Module Data', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/modules/{moduleId}/data', () => {
    // TODO:
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/modules/{moduleId}/data', () => {
    it('200s with an array of app module data objects owned by app module', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/data`)
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appModuleDataObject => {
            appModuleDataObject.should.be.an('object');
            appModuleDataObject.appModuleId.should.equal(1);
          });
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
          done();
        });
    });

    it('400s when passed invalid app module data id', done => {
      chai.request(server)
        .get(`/apps/${appId}/modules/1/data/124124`)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it403sWhenPassedAppModuleIdNotOwnedByApp('get', '/apps/1/modules/4124/data');
  });
});
