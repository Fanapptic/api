/*
 * Route: /articles/:articleId?
 */

const ArticleModel = rootRequire('/models/Article');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const adminAuthorize = rootRequire('/middlewares/users/admin/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', (request, response, next) => {
  const { articleId } = request.params;

  if (articleId) {
    ArticleModel.find({ where: { id: articleId } }).then(article => {
      if (!article) {
        throw new Error('The article does not exist.');
      }

      response.success(article);
    });
  } else {
    ArticleModel.findAll().then(articles => {
      response.success(articles);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', adminAuthorize);
router.post('/', (request, response, next) => { // TODO: Secure this.
  const { author, icon, title, commentary, content, draft, news } = request.body;

  ArticleModel.create({
    author,
    icon,
    title,
    commentary,
    content,
    draft,
    news,
  }).then(article => {
    response.success(article);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', userAuthorize);
router.patch('/', adminAuthorize);
router.patch('/', (request, response, next) => { // TODO: Secure this.
  const { articleId } = request.params;
  const { author, icon, title, commentary, content, draft, news } = request.body;

  ArticleModel.find({ where: { id: articleId } }).then(article => {
    if (!article) {
      throw new Error('The article does not exist.');
    }

    article.author = author || article.author;
    article.icon = icon || article.icon;
    article.title = title || article.title;
    article.commentary = commentary || article.commentary;
    article.content = content || article.content;
    article.draft = draft || article.draft;
    article.news = news || article.news;

    return article.save();
  }).then(article => {
    response.success(article);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
