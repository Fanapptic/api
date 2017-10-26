const helpers = require('../helpers');

describe('Articles', () => {
  /*
   * POST
   */

  describe('POST /articles', () => {
    it('200s with created article object', done => {
      const fields = {
        author: 'Braydon Batungbacal',
        icon: 'ion-social-facebook',
        title: 'Awesome Title',
        commentary: 'Some details about what this is about.',
        content: 'This is content <b>cool!</b>',
        published: true,
        news: true,
      };

      chai.request(server)
        .post('/articles')
        .set('X-Access-Token', testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.author.should.equal(fields.author);
          response.body.icon.should.equal(fields.icon);
          response.body.title.should.equal(fields.title);
          response.body.commentary.should.equal(fields.commentary);
          response.body.content.should.equal(fields.content);
          response.body.published.should.equal(fields.published);
          response.body.news.should.equal(fields.news);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/articles');
  });

  /*
   * PATCH
   */

  describe('PATCH /articles', () => {
    it('200s with updated articled object', done => {
      const fields = {
        author: 'Braydo Batungba',
        icon: 'ion-social-instagram',
        title: 'Changed Title',
        commentary: 'Some new commentary',
        content: 'Some new content',
        published: false,
        news: false,
      };

      chai.request(server)
        .patch('/articles/1')
        .set('X-Access-Token',testUser.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.author.should.equal(fields.author);
          response.body.icon.should.equal(fields.icon);
          response.body.title.should.equal(fields.title);
          response.body.commentary.should.equal(fields.commentary);
          response.body.content.should.equal(fields.content);
          response.body.published.should.equal(fields.published);
          response.body.news.should.equal(fields.news);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/articles');
  });

  /*
   * GET
   */

  describe('GET /articles', () => {
    it('200s with an array or article objects', done => {
      chai.request(server)
        .get('/articles')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(articleObject => {
            articleObject.should.be.an('object');
          });
          done();
        });
    });

    it('200s with article object when passed article id', done => {
      chai.request(server)
        .get('/articles/1')
        .set('X-Access-Token', testUser.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.title.should.be.a('string');
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/articles');
  });
});
