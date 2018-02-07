/*
 * Route: {API Base Route}/posts/:postId/ratings/:postRatingId?
 */

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

router.post('/', (request, response) => {
  response.success('goodbye!');
});

/*
 * Export
 */

module.exports = router;
