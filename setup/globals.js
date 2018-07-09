const path = require('path');

const rootPath = __dirname.replace('/setup', '');

global.rootPath = rootPath;
global.rootRequire = filePath => {
  return require(path.join(rootPath, filePath));
};

global.express = require('express');
global.Sequelize = require('sequelize');
global.database = rootRequire('/libs/database');
