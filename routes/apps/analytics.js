/*
 * Route: /apps/:appId/analytics
 */

const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const AppRevenueModel = rootRequire('/models/AppRevenue');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const AppDeviceModel = rootRequire('/models/AppDevice');

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

  // TODO: Anything using appSession is not referencing by appId - it's getting everything.

  // Weekly Downloads - Total
  promises.push(AppDeviceModel.count({
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
  promises.push(AppDeviceModel.count({
    where: {
      appId,
    },
  }).then(count => {
    totalDownloads = count;
  }));

  // Daily Active Users - Total
  promises.push(AppDeviceSessionModel.count({
    distinct: true,
    col: 'appDeviceId',
    where: {
      startedAt: {
        $gt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    },
  }).then(count => {
    dailyActiveUsers = count;
  }));

  // Weekly Active Users - Total
  promises.push(AppDeviceSessionModel.count({
    distinct: true,
    col: 'appDeviceId',
    where: {
      startedAt: {
        $gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    },
  }).then(count => {
    weeklyActiveUsers = count;
  }));

  // Daily Usage - Average
  promises.push(AppDeviceSessionModel.find({
    attributes: [[
      database.fn('avg',
        database.fn('timestampdiff', database.literal('MINUTE'), database.col('startedAt'), database.col('endedAt'))
      ),
      'usage',
    ]],
    where: {
      startedAt: {
        $gt: new Date(Date.now() - 60 * 60 * 24 * 1000),
      },
      endedAt: {
        $ne: null,
      },
    },
  }).then(result => {
    dailyUsage = parseInt(result.dataValues.usage) || 0; // find returns string, convert to number
  }));

  // Total Usage - Sum
  promises.push(AppDeviceSessionModel.find({
    attributes: [[
      database.fn('sum',
        database.fn('timestampdiff', database.literal('MINUTE'), database.col('startedAt'), database.col('endedAt'))
      ),
      'usage',
    ]],
    where: {
      endedAt: {
        $ne: null,
      },
    },
  }).then(result => {
    totalUsage = parseInt(result.dataValues.usage) || 0; // .find returns string, convert to number
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
