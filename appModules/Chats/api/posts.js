/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId?
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
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
    PostModel.find({
      where: { id: postId, appModuleId },
      include: [ NetworkUserModel ],
    }).then(post => {
      if (!post) {
        throw new Error('The post does not exist.');
      }

      response.success(post);
    }).catch(next);
  } else {
    PostModel.findAll({
      where: { appModuleId },
      include: [ NetworkUserModel ],
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
 * DELETE
 */

router.delete('/', networkUserAuthorize);
router.delete('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { postId } = request.params;

  PostModel.destroy({ where: { id: postId, networkUserId } }).then(affectedRows => {
    if (!affectedRows) {
      throw new Error('The post does not exist.');
    }

    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
