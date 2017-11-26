const AppModel = rootRequire('/models/App');
const AppDeploymentModel = rootRequire('/models/AppDeployment');
const AppDeploymentStepModel = rootRequire('/models/AppDeploymentStep');
const AppRevenueModel = rootRequire('/models/AppRevenue');
const AppModuleModel = rootRequire('/models/AppModule');
const AppModuleDataModel = rootRequire('/models/AppModuleData');
const AppModuleProviderModel = rootRequire('/models/AppModuleProvider');
const AppPushNotificationModel = rootRequire('/models/AppPushNotification');
const AppSessionModel = rootRequire('/models/AppSession');
const AppUserModel = rootRequire('/models/AppUser');

const ArticleModel = rootRequire('/models/Article');
const CurrencyModel = rootRequire('/models/Currency');
const UserModel = rootRequire('/models/User');

AppModel.hasMany(AppDeploymentModel);
AppModel.hasMany(AppModuleModel);
AppModel.hasMany(AppPushNotificationModel);
AppModel.hasMany(AppRevenueModel);
AppModel.hasMany(AppSessionModel);
AppModel.hasMany(AppUserModel);
AppDeploymentModel.hasMany(AppDeploymentStepModel);
AppModuleModel.hasMany(AppModuleDataModel);
AppModuleModel.hasMany(AppModuleProviderModel);
AppModuleProviderModel.hasMany(AppModuleDataModel);
AppUserModel.hasMany(AppSessionModel);

CurrencyModel.hasMany(AppRevenueModel);
UserModel.hasMany(AppModel);

database.sync({
  //force: true,
});
