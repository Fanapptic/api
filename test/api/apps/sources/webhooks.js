const querystring = require('querystring');
const helpers = require('../../../helpers');

describe('App Source Webhooks', () => {
  /*
   * GET
   */

  describe('GET /apps/{appId}/sources/{appSourceId}/webhooks', () => {
    const query = {
      type: 'facebook',
      webhookToken: '71ec605b-085b-434e-b6e1-6b55f0ca4193',
      'hub.mode': 'subscribe',
      'hub.challenge': 'random-182747yfqiyf',
      'hub.verify_token': 'somePointlessSpecificationValue',
    };

    it('200s when passed PubSubHubbub verification and type', done => {
      chai.request(server)
        .get('/apps/*/sources/*/webhooks?' + querystring.stringify(query))
        .end((error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('400s when missing any PubSubHubbub verification argument', done => {
      const incompleteQuery = Object.assign({}, query, {
        'hub.mode': null,
      });

      chai.request(server)
        .get('/apps/*/sources/*/webhooks?' + querystring.stringify(incompleteQuery))
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    it('400s when missing type argument', done => {
      const incompleteQuery = Object.assign({}, query, {
        type: null,
      });

      chai.request(server)
        .get('/apps/*/sources/*/webhooks?' + querystring.stringify(incompleteQuery))
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenPassedInvalidWebhookToken(
      'get',
      '/apps/*/sources/*/webhooks?' +
        querystring.stringify(Object.assign({}, query, {
          webhookToken: null,
        }))
    );
  });

  /*
   * POST
   */

  describe('POST /apps/{appId}/sources/{appSourceId}/webhooks', () => {
    const query = {
      type: 'facebook',
      webhookToken: '71ec605b-085b-434e-b6e1-6b55f0ca4193',
    };

    it('204s when passed type', done => {
      chai.request(server)
        .post('/apps/*/sources/*/webhooks?' + querystring.stringify(query))
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('400s when passed invalid type', done => {
      const invalidQuery = Object.assign({}, query, {
        type: 'dawdaiw',
      });

      chai.request(server)
        .post('/apps/*/sources/*/webhooks?' + querystring.stringify(invalidQuery))
        .end((error, response) => {
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenPassedInvalidWebhookToken(
      'post',
      '/apps/*/sources/*/webhooks?' +
        querystring.stringify(Object.assign({}, query, {
          webhookToken: null,
        }))
    );
  });
});
