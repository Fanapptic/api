/*
 * Route: /apps/:appId/analytics
 */

const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const AppRevenueModel = rootRequire('/models/AppRevenue');
const AppSessionModel = rootRequire('/models/AppSession');
const AppUserModel = rootRequire('/models/AppUser');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId } = request.params;
  let weeklyDownloads = 0;
  let totalDownloads = 0;
  let dailyActiveUsers = 0;
  let weeklyActiveUsers = 0;
  let dailyUsage = 0;
  let totalUsage = 0;
  let dailyRevenue = 0;
  let totalRevenue = 0;
  let promises = [];

  // Weekly Downloads - Total
  promises.push(AppUserModel.count({
    where: {
      appId,
      createdAt: {
        $gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    },
  }).then(count => {
    weeklyDownloads = count;
  }));

  // Total Downloads - Total
  promises.push(AppUserModel.count({
    where: {
      appId,
    },
  }).then(count => {
    totalDownloads = count;
  }));

  // Daily Active Users - Total
  promises.push(AppSessionModel.count({
    distinct: true,
    col: 'appUserId',
    where: {
      appId,
      startedAt: {
        $gt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    },

  }).then(count => {
    dailyActiveUsers = count;
  }));

  // Weekly Active Users - Total
  promises.push(AppSessionModel.count({
    distinct: true,
    col: 'appUserId',
    where: {
      appId,
      startedAt: {
        $gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    },
  }).then(count => {
    weeklyActiveUsers = count;
  }));

  // Daily Usage - Average
  promises.push(AppSessionModel.find({
    attributes: [[
      database.fn('avg',
        database.fn('timestampdiff', database.literal('MINUTE'), database.col('startedAt'), database.col('endedAt'))
      ),
      'usage',
    ]],
    where: {
      appId,
      startedAt: {
        $gt: new Date(Date.now() - 60 * 60 * 24 * 1000),
      },
      endedAt: {
        $ne: null,
      },
    },
  }).then(result => {
    dailyUsage = result.dataValues.usage || 0;
  }));

  // Total Usage - Sum
  promises.push(AppSessionModel.find({
    attributes: [[
      database.fn('sum',
        database.fn('timestampdiff', database.literal('MINUTE'), database.col('startedAt'), database.col('endedAt'))
      ),
      'usage',
    ]],
    where: {
      appId,
      endedAt: {
        $ne: null,
      },
    },
  }).then(result => {
    totalUsage = result.dataValues.usage || 0;
  }));

  // Daily Revenue - Sum
  promises.push(AppRevenueModel.sum('amount', {
    where: {
      appId,
      createdAt: {
        $gt: new Date(Date.now() - 60 * 60 * 24 * 1000),
      },
    },
  }).then(amount => {
    dailyRevenue = amount || 0;
  }));

  // Total Revenue - Sum
  promises.push(AppRevenueModel.sum('amount', {
    where: {
      appId,
      createdAt: {
        $gt: new Date(Date.now() - 60 * 60 * 24 * 1000 * 7),
      },
    },
  }).then(amount => {
    totalRevenue = amount || 0;
  }));

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
      adRevenue: {
        daily: dailyRevenue,
        monthly: totalRevenue,
      },
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
