/*
 * Route: /apps/:appId/analytics
 */

const AppDeviceModel = rootRequire('/models/AppDevice');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const AppFeedActivityModel = rootRequire('/models/AppFeedActivity');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorizeOwnership = rootRequire('/middlewares/apps/authorizeOwnership');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorizeOwnership);
router.get('/', (request, response, next) => {
  const { appId } = request.params;
  let promises = [];

  const dayAgoDate = new Date();
  dayAgoDate.setDate(dayAgoDate.getDate() - 1);

  const weekAgoDate = new Date();
  weekAgoDate.setDate(weekAgoDate.getDate() - 7);

  let weeklyDownloads = 0;
  let totalDownloads = 0;
  let dailyActiveUsers = 0;
  let weeklyActiveUsers = 0;
  let dailyUsage = 0;
  let totalUsage = 0;
  let dailyContentViews = 0;
  let totalContentViews = 0;

  // Weekly Downloads
  promises.push(
    AppDeviceModel.count({
      where: {
        appId,
        createdAt: {
          $gte: weekAgoDate,
        },
      },
    }).then(_weeklyDownloads => weeklyDownloads = _weeklyDownloads)
  );

  // Total Downloads
  promises.push(
    AppDeviceModel.count({
      where: { appId },
    }).then(_totalDownloads => totalDownloads = _totalDownloads)
  );

  // Daily Active Users
  promises.push(
    AppDeviceSessionModel.count({
      where: {
        appId,
        startedAt: {
          $gte: dayAgoDate,
        },
      },
      group: [ 'appDeviceId' ],
    }).then(_dailyActiveUsers => dailyActiveUsers = _dailyActiveUsers.length)
  );

  // Weekly Active Users
  promises.push(
    AppDeviceSessionModel.count({
      where: {
        appId,
        startedAt: {
          $gte: weekAgoDate,
        },
      },
      group: [ 'appDeviceId' ],
    }).then(_weeklyActiveUsers => weeklyActiveUsers = _weeklyActiveUsers.length)
  );

  // Daily Usage
  promises.push(
    database.query(
      'SELECT (SUM(endedAt) - SUM(startedAt)) AS dailyUsage ' +
      'FROM appDeviceSessions ' +
      `WHERE appId = ${appId} ` +
      'AND startedAt > NOW() - INTERVAL 1 DAY ' +
      'AND endedAt > 0'
    ).then(result => {
      dailyUsage = Math.floor(result[0][0].dailyUsage / 60);
    })
  );

  // Total Usage
  promises.push(
    database.query(
      'SELECT (SUM(endedAt) - SUM(startedAt)) AS totalUsage ' +
      'FROM appDeviceSessions ' +
      `WHERE appId = ${appId} ` +
      'AND endedAt > 0'
    ).then(result => {
      totalUsage = Math.floor(result[0][0].totalUsage / 60);
    })
  );

  // Daily Content Views
  promises.push(
    AppFeedActivityModel.count({
      where: {
        appId,
        createdAt: {
          $gte: dayAgoDate,
        },
      },
    }).then(_dailyContentViews => dailyContentViews = _dailyContentViews)
  );

  // Total Content Views
  promises.push(
    AppFeedActivityModel.count({
      where: { appId },
    }).then(_totalContentViews => totalContentViews = _totalContentViews)
  );

  // Response
  Promise.all(promises).then(() => {
    response.success({
      downloads: {
        weekly: weeklyDownloads,
        total: totalDownloads,
      },
      activeUsers: {
        daily: dailyActiveUsers,
        weekly: weeklyActiveUsers,
      },
      usage: {
        daily: dailyUsage,
        total: totalUsage,
      },
      contentViews: {
        daily: dailyContentViews,
        total: totalContentViews,
      },
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
