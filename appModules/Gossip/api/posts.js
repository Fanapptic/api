/*
 * Route: /apps/:appId/modules/:appModuleId/api/gossip/posts/:postId?
 */

const PostModel = require('../models/Post');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const { appModuleId, postId } = request.params;

  if (postId) {
    PostModel.find({ where: { id: postId, appModuleId } }).then(post => {
      if (!post) {
        throw new Error('The post does not exist.');
      }

      response.success(post);
    }).catch(next);
  } else {
    PostModel.findAll({
      where: { appModuleId },
      order: [['createdAt', 'DESC']],
    }).then(posts => {
      response.success(posts);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { appModuleId } = request.params;
  const { content } = request.body;

  PostModel.create({ appModuleId, networkUserId, content }).then(post => {
    response.success(post);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
