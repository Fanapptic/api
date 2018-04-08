/*
 * Route: /apps/:appId/modules/:appModuleId/api/community/posts/:postId?
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostModel = require('../models/Post');
const PostVoteModel = require('../models/PostVote');
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
  const { sort } = request.query;

  let attributes = Object.keys(PostModel.attributes);

  if (request.networkUser.id) {
    attributes = attributes.concat([
      [database.literal('(' +
        'SELECT `modules_community_postVotes`.`vote` ' +
        'FROM `modules_community_postVotes` ' +
        'WHERE `modules_community_postVotes`.`postId` = `modules_community_post`.`id` ' +
        'AND `modules_community_postVotes`.`networkUserId` = ' + request.networkUser.id +
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
    let order = [['createdAt', 'DESC']];

    if (sort === 'totalComments') {
      order = [['totalComments', 'DESC']];
    }

    if (sort === 'totalUpvotes') {
      order = [['totalUpvotes', 'DESC']];
    }

    PostModel.findAll({
      attributes,
      where: { appModuleId },
      include: [ NetworkUserModel ],
      order,
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
  const totalUpvotes = 1;

  let post = null;

  // TODO: This should be done as a transaction
  PostModel.create({ appModuleId, networkUserId, content, totalUpvotes }).then(_post => {
    post = _post;

    return PostVoteModel.create({ postId: post.id, networkUserId, vote: 1 });
  }).then(() => {
    post = post.toJSON();
    post.loggedInNetworkUserVote = 1;

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