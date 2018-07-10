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
  let dailyUsageSumStartedAt = 0;

  promises.push(
    AppDeviceSessionModel.sum('startedAt', {
      where: {
        appId,
        startedAt: {
          $gte: dayAgoDate,
        },
        endedAt: {
          $ne: null,
        },
      },
    }).then(_dailyUsageSumStartedAt => {
      dailyUsageSumStartedAt = _dailyUsageSumStartedAt;

      return AppDeviceSessionModel.sum('endedAt', {
        where: {
          appId,
          startedAt: {
            $gte: dayAgoDate,
          },
          endedAt: {
            $ne: null,
          },
        },
      });
    }).then(dailyUsageSumEndedAt => {
      dailyUsage =  dailyUsageSumEndedAt - dailyUsageSumStartedAt;
    })
  );

  // Total Usage
  let totalUsageSumStartedAt = 0;

  promises.push(
    AppDeviceSessionModel.sum('startedAt', {
      where: {
        appId,
        endedAt: {
          $ne: null,
        },
      },
    }).then(_totalUsageSumStartedAt => {
      totalUsageSumStartedAt = _totalUsageSumStartedAt;

      return AppDeviceSessionModel.sum('endedAt', {
        where: {
          appId,
          endedAt: {
            $ne: null,
          },
        },
      });
    }).then(totalUsageSumEndedAt => {
      dailyUsage =  totalUsageSumEndedAt - totalUsageSumStartedAt;
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
        weeklyDownloads,
        totalDownloads,
      },
      activeUsers: {
        dailyActiveUsers,
        weeklyActiveUsers,
      },
      usage: {
        dailyUsage,
        totalUsage,
      },
      contentViews: {
        dailyContentViews,
        totalContentViews,
      },
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
