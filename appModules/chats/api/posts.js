/*
 * Route: /apps/:appId/modules/:appModuleId/api/chats/posts/:postId?
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('../models/Post');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const networkUserAuthorizeOptional = rootRequire('/middlewares/networks/users/authorizeOptional');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', networkUserAuthorizeOptional);
router.get('/', (request, response, next) => {
  const { appModuleId, postId } = request.params;

  let attributes = Object.keys(PostModel.attributes);

  if (request.networkUser.id) {
    attributes = attributes.concat([
      [database.literal('(' +
        'SELECT `modules_chats_postVotes`.`vote` ' +
        'FROM `modules_chats_postVotes` ' +
        'WHERE `modules_chats_postVotes`.`postId` = `modules_chats_post`.`id` ' +
        'AND `modules_chats_postVotes`.`networkUserId` = ' + request.networkUser.id +
      ')'), 'loggedInNetworkUserVote'],
    ]);
  }

  if (postId) {
    PostModel.find({
      attributes,
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
      attributes,
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
