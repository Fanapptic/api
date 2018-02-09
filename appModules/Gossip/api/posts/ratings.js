/*
 * Route: /apps/:appId/modules/:appModuleId/api/gossip/posts/:postId/ratings/:postRatingId?
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');
const PostRatingModel = require('../../models/PostRating');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const postAuthorize = require('../../middlewares/posts/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', postAuthorize);
router.get('/', (request, response, next) => {
  const { postId, postRatingId } = request.params;

  if (postRatingId) {
    PostRatingModel.find({
      where: { id: postRatingId, postId },
      include: [ NetworkUserModel ],
    }).then(postRating => {
      if (!postRating) {
        throw new Error('The post rating does not exist.');
      }

      response.success(postRating);
    }).catch(next);
  } else {
    PostRatingModel.findAll({
      where: { postId },
      include: [ NetworkUserModel ],
    }).then(postRatings => {
      response.success(postRatings);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', postAuthorize);
router.post('/', (request, response, next) => {
  const networkUserId = request.networkUser.id;
  const { postId } = request.params;
  const { rating } = request.body;

  PostRatingModel.upsert({ postId, networkUserId, rating }).then(() => {
    return PostRatingModel.find({ where: { postId, networkUserId } });
  }).then(postRating => {
    response.success(postRating);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
