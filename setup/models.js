const path = require('path');
const fs = require('fs');

const appModules = rootRequire('/appModules');

/*
 * Core Models
 */

const AppModel = rootRequire('/models/App');
const AppDeploymentModel = rootRequire('/models/AppDeployment');
const AppDeploymentStepModel = rootRequire('/models/AppDeploymentStep');
const AppRevenueModel = rootRequire('/models/AppRevenue');
const AppModuleModel = rootRequire('/models/AppModule');
const AppModuleDataModel = rootRequire('/models/AppModuleData');
const AppModuleProviderModel = rootRequire('/models/AppModuleProvider');
const AppPushNotificationModel = rootRequire('/models/AppPushNotification');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const AppDeviceModel = rootRequire('/models/AppDevice');

const ArticleModel = rootRequire('/models/Article');
const CurrencyModel = rootRequire('/models/Currency');
const NetworkUserModel = rootRequire('/models/NetworkUser');
const UserModel = rootRequire('/models/User');
const UserAgreementModel = rootRequire('/models/UserAgreement');

AppModel.hasMany(AppDeploymentModel);
AppModel.hasMany(AppModuleModel);
AppModel.hasMany(AppPushNotificationModel);
AppModel.hasMany(AppRevenueModel);
AppModel.hasMany(AppDeviceModel);
AppDeploymentModel.hasMany(AppDeploymentStepModel);
AppModuleModel.hasMany(AppModuleDataModel);
AppModuleModel.hasMany(AppModuleProviderModel);
AppModuleProviderModel.hasMany(AppModuleDataModel);
AppDeviceModel.hasMany(AppDeviceSessionModel);

CurrencyModel.hasMany(AppRevenueModel);
NetworkUserModel.hasMany(AppDeviceSessionModel);
UserModel.hasMany(AppModel);
UserModel.hasMany(UserAgreementModel);

/*
 * Module Models
 */

appModules.moduleNames.forEach(moduleName => {
  const modelsPath = path.join(rootPath, `/appModules/${moduleName}/models`);

  if (fs.existsSync(modelsPath)) {
    require(modelsPath);
  }
});

/*
 * Export
 */

module.exports = database.sync({
  force: (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'local'),
});
