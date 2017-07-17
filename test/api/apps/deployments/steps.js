const helpers = require('../../../helpers');

describe('App Deployment Steps', () => {
  /*
   * POST
   */

  describe('POST /apps/{appId}/deployments/{appDeploymentId}/steps', () => {
    const fields = {
      platform: 'ios',
      name: 'Provision',
      message: 'This application was successfully provisioned.',
      success: true,
    };

    it('200s with created app deployment step objected owned by app deployment', done => {
      chai.request(server)
        .post(`/apps/${appId}/deployments/1/steps`)
        .set('X-Internal-Token', internalToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appDeploymentId.should.equal('1');
          response.body.platform.should.equal(fields.platform);
          response.body.name.should.equal(fields.name);
          response.body.message.should.equal(fields.message);
          response.body.success.should.equal(fields.success);
          done();
        });
    });

    //it('400s when creating a step that has already been created for the deployment', done => {
    //  done();
    //});

    helpers.it401sWhenAuthorizationIsInvalid('get', '/apps/1/deployments/1/steps');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('get', '/apps/1421/deployments/1/steps');
    helpers.it403sWhenPassedAppDeploymentIdNotOwnedByApp('get', '/apps/1/deployments/1241/steps');
  });

  /*
   * GET
   */

  describe('GET /apps/{appId}/deployments/{appDeploymentId}/steps', () => {
    it('200s with an array of app deployment steps owned by app deployment', done => {
      chai.request(server)
        .get(`/apps/${appId}/deployments/1/steps`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(appDeploymentStepObject => {
            appDeploymentStepObject.should.be.an('object');
            appDeploymentStepObject.appDeploymentId.should.equal(1);
          });
          done();
        });
    });

    it('200s with an app deployment step object owned by app deployment when passed app deployment step id', done => {
      chai.request(server)
        .get(`/apps/${appId}/deployments/1/steps/1`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.appDeploymentId.should.equal(1);
          done();
        });
    });

    it('400s when passed invalid app deployment step id', done => {
      chai.request(server)
        .get(`/apps/${appId}/deployments/1/steps/3123`)
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenAuthorizationIsInvalid('post', '/apps/1/deployments/1/steps');
    helpers.it403sWhenPassedAppIdNotOwnedByUser('post', '/apps/1321/deployments/1/steps');
    helpers.it403sWhenPassedAppDeploymentIdNotOwnedByApp('post', '/apps/1/deployments/1241/steps');
  });
});
