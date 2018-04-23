const fs = require('fs');
const globPromise = require('glob-promise');
const portScanner = require('portscanner');
const helpers = require('./helpers');

/*
 * Import Environment Variables
 */

require('dotenv').config(); // machine level env takes priority over .env file

/*
 * Start A Local Server Instance If Necessary
 */

portScanner.checkPortStatus(process.env.PORT, 'localhost', (error, status) => {
  if (status === 'closed') {
    require('../worker');
  }
});

/*
 * Set Globals
 */

global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = `http://localhost:${process.env.PORT}`;

global.appId = 1;

global.testUser = {
  id: null,
  email: 'tester@fanapptic.com',
  password: 'testpassword',
  accessToken: null,
  firstName: 'Fanapptic',
  lastName: 'Man',
  phoneNumber: '+12535452412',
  paypalEmail: 'testemail@gmail.com',
};

global.testAppDevice = {
  id: null,
  appId: null,
  uuid: null,
  platform: 'ios',
};

global.testAppDeployment = {
  id: null,
  appId: null,
};

global.testAppModule = {
  id: null,
  appId: appId,
  name: 'feed',
  position: 0,
};

global.testAppModuleProvider = {
  dataSource: 'instagram',
  avatarUrl: 'https://scontent.cdninstagram.com/t51.2885-19/11809603_737295259710174_813805448_a.jpg',
  accountId: '417616778',
  accountName: 'braydo25',
  accountUrl: 'https://www.instagram.com/braydo25',
  accessToken: '417616778.20d8092.7c0160e2b09c4f598bb54f2e0274c3fc',
  accessTokenSecret: null,
  refreshToken: null,
};

global.testNetworkUser = {
  facebookAccessToken: 'EAAFfFpdEd8UBAJU0KZBELCD5zry7kxySSuG8sm8F0aLgB6xdXRjqil9EFnqmtZCFSqIWAGglkmPYFpZCZCs8Bn9KNdXLy6covzFweZCSfymqZAJUtGjor3YE4RDVt4r7qochm3zp78gBUp2ZAXJU950z9RPbOKkUjZCZCZCv0hGbZBCV0Illm9pPvv1',
};

global.testNetworkUserAttachment = {};

chai.should();
chai.use(chaiHttp);

/*
 * Setup Test Environement
 */

const waitPort = require('wait-port');
const Sequelize = require('sequelize');
const database = {
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_WRITE_HOST,
  port: process.env.MYSQL_PORT,
};

before(done => {
  const sequelize = new Sequelize(database.database, database.username, database.password, {
    host: database.host,
    dialect: 'mysql',
    port: database.port,
  });

  let appModuleTestFiles = {};
  let appModuleTestEnvironments = {};

  fatLog('Waiting for local server to come online...');

  waitPort({
    host: 'localhost',
    port: parseInt(process.env.PORT),
  }).then(() => {
    fatLog('Testing DB connection...');

    return sequelize.authenticate();
  }).then(() => {
    fatLog('Truncating DB...');

    return sequelize.transaction(transaction => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction }).then(() => {
        return sequelize.query(`
          SELECT Concat('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';')
          FROM INFORMATION_SCHEMA.TABLES
          WHERE table_schema in ('${database.database}');`,
          { transaction }
        );
      }).then(results => {
        let truncatePromises = [];

        results[0].forEach(result => {
          Object.keys(result).forEach(key => {
            truncatePromises.push(sequelize.query(result[key], { transaction }));
          });
        });

        return Promise.all(truncatePromises);
      });
    }).then(() => {
      fatLog('Creating global test user & app in DB...');

      return chai.request(server).post('/users').send(testUser);
    }).then(response => {
      fatLog('Adding icon to global test app...');

      Object.assign(testUser, response.body);

      return chai.request(server)
        .patch(`/apps/${appId}`)
        .set('X-Access-Token', testUser.accessToken)
        .attach('icon', fs.readFileSync('./test/icon.png'), 'icon.png');
    }).then(() => {
      fatLog('Creating completed release agreement for global user...');

      return sequelize.query(`
        INSERT INTO userAgreements
        (userId, agreement, email, signedAgreementUrl, createdAt, updatedAt)
        VALUES (${testUser.id}, 'release', '${testUser.email}', 'placeholder.com', NOW(), NOW())
      `);
    }).then(() => {
      fatLog('Making global test user an admin...');

      return sequelize.query(`
        UPDATE users
        SET admin = 1
        WHERE id = ${testUser.id}
      `);
    }).then(() => {
      fatLog('Updating global test app...');

      return chai.request(server)
        .patch(`/apps/${appId}`)
        .set('X-Access-Token', testUser.accessToken)
        .send({
          name: 'test name',
          displayName: 'cool app',
          subtitle: 'a subtitle',
          description: 'a long description',
          keywords: 'some,great,keywords',
          website: 'http://www.mysite.com/',
          contentRating: '9+',
        });
    }).then(() => {
      fatLog('Adding initial modules to global test app...');

      let promises = [];

      for (let i = 0; i < 2; i++) {
        promises.push(
          chai.request(server)
            .post(`/apps/${appId}/modules`)
            .set('X-Access-Token', testUser.accessToken)
            .send({ name: 'feed' })
        );
      }

      return Promise.all(promises);
    }).then(() => {
      fatLog('Creating global test app device in DB...');

      return chai.request(server).post('/apps/1/devices').send(testAppDevice);
    }).then(response => {
      Object.assign(testAppDevice, response.body);
      fatLog('Creating global test app deployment in DB...');

      return chai.request(server)
        .post('/apps/1/deployments')
        .set('X-Access-Token', testUser.accessToken)
        .send(testAppDeployment);
    }).then(response => {
      Object.assign(testAppDeployment, response.body);
      fatLog('Creating global test app module in DB...');

      return chai.request(server)
        .post('/apps/1/modules')
        .set('X-Access-Token', testUser.accessToken)
        .send(testAppModule);
    }).then(response => {
      Object.assign(testAppModule, response.body);
      fatLog('Creating global test app module provider in DB...');

      return chai.request(server)
        .post('/apps/1/modules/1/providers')
        .set('X-Access-Token', testUser.accessToken)
        .send(testAppModuleProvider);
    }).then(response => {
      Object.assign(testAppModuleProvider, response.body);
      fatLog('Creating global test network user in DB...');

      return chai.request(server)
        .post('/networks/fanapptic/users')
        .send(testNetworkUser);
    }).then(response => {
      Object.assign(testNetworkUser, response.body);
      fatLog('Creating global test network user attachment in DB...');

      return chai.request(server)
        .post('/networks/fanapptic/users/1/attachments')
        .set('X-Network-User-Access-Token', testNetworkUser.accessToken)
        .attach('media', fs.readFileSync('./test/video.mp4'), 'media.mp4');
    }).then(response => {
      Object.assign(testNetworkUserAttachment, response.body);
      fatLog('Aggregating app module tests...');

      return globPromise('appModules/**/test/**/*.js');
    }).then(_appModuleTestFiles => {
      appModuleTestFiles = _appModuleTestFiles;
      fatLog('Creating app module environments...');

      let pendingModuleTestEnvironments = [];
      let promises = [];

      appModuleTestFiles.forEach(appModuleTestFile => {
        const moduleName = appModuleTestFile.split('/')[1].toLowerCase();

        if (pendingModuleTestEnvironments.includes(moduleName)) {
          return;
        }

        pendingModuleTestEnvironments.push(moduleName);

        promises.push(createAppModuleTestEnvironment(moduleName).then(testEnvironment => {
          appModuleTestEnvironments[moduleName] = testEnvironment;
        }));
      });

      return Promise.all(promises);
    }).then(() => {
      fatLog('Queuing app module tests...');

      appModuleTestFiles.forEach(appModuleTestFile => {
        const moduleName = appModuleTestFile.split('/')[1].toLowerCase();
        const appModuleTestEnvironment = appModuleTestEnvironments[moduleName];

        if (appModuleTestFile.includes('helpers.js')) {
          return;
        }

        describe(`App Module - ${moduleName}`, () => {
          require(`../${appModuleTestFile}`)(appModuleTestEnvironment);
        });
      });

      fatLog('Starting tests...');
      done();
    });
  }).catch(e => {
    console.error(e);
    process.exit(1); // for CI
  });
});

/*
 * Helpers
 */

function createAppModuleTestEnvironment(moduleName) {
  let environment = {
    user: null,
    app: null,
    appModule: null,
    appModuleApiBaseUrl: null,
    networkUser: testNetworkUser,
    networkUserAttachment: testNetworkUserAttachment,
    helpers,
  };

  return chai.request(server).post('/users').send({
    email: `${moduleName}@fanapptic-modules.com`,
    password: moduleName,
  }).then(response => {
    const user = response.body;

    environment.user = user;

    return chai.request(server)
      .get('/apps')
      .set('X-Access-Token', user.accessToken);
  }).then(response => {
    const app = response.body[0];

    environment.app = app;

    return chai.request(server)
      .post(`/apps/${app.id}/modules`)
      .set('X-Access-Token', environment.user.accessToken)
      .send({
        name: moduleName,
      });
  }).then(response => {
    environment.appModule = response.body;
    environment.appModuleApiBaseUrl = `/apps/${environment.app.id}/modules/${environment.appModule.id}/api/${moduleName}`;

    return environment;
  });
}

function fatLog(message) {
  let divider = Array(message.length + 1).join('=');

  console.log('\n');
  console.log(divider);
  console.log(message);
  console.log(divider);
  console.log('\n');
}
