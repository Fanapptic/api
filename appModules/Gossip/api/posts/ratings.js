/*
 * Route: /apps/:appId/modules/:appModuleId/api/gossip/posts/:postId/ratings/:postRatingId?
 */

const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response) => {
  response.success('hello!');
});

/*
 * POST
 */

router.post('/', networkUserAuthorize);
router.post('/', (request, response) => {
  response.success('goodbye!');
});

/*
 * Export
 */

module.exports = router;
