const AppModel = rootRequire('/models/App');
const AppDeviceModel = rootRequire('/models/AppDevice');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const AppFeedActivityModel = rootRequire('/models/AppFeedActivity');
const AppNotificationModel = rootRequire('/models/AppNotification');
const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const AppUserModel = rootRequire('/models/AppUser');
const UserModel = rootRequire('/models/User');
const UserChargeModel = rootRequire('/models/UserCharge');

AppModel.hasMany(AppUserModel);
AppModel.hasMany(AppDeviceModel);
AppModel.hasMany(AppDeviceSessionModel);
AppModel.hasMany(AppFeedActivityModel);
AppModel.hasMany(AppNotificationModel);
AppModel.hasMany(AppSourceModel);
AppModel.hasMany(AppSourceContentModel);
AppDeviceModel.hasMany(AppDeviceSessionModel);
AppDeviceModel.hasMany(AppFeedActivityModel);
AppDeviceModel.hasMany(AppNotificationModel);
AppDeviceSessionModel.hasMany(AppFeedActivityModel);
AppSourceContentModel.belongsTo(AppSourceModel);
AppSourceContentModel.hasMany(AppFeedActivityModel);
AppUserModel.hasMany(AppDeviceModel);
AppUserModel.hasMany(AppDeviceSessionModel);
AppUserModel.hasMany(AppFeedActivityModel);

UserModel.hasMany(AppModel);
UserModel.hasMany(UserChargeModel);

module.exports = database.sync();
