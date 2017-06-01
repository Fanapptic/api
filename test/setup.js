/*
 * Set Globals
 */

global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = 'http://localhost:8000';
global.testUser = {
  email: 'tester@fanapptic.com',
  password: 'testpassword',
  accessToken: '',
  firstName: 'Fanapptic',
  lastName: 'Man',
  phoneNumber: '+12535452412',
};

chai.should();
chai.use(chaiHttp);

/*
 * Test Connection
 * Truncate DB
 * Create Global Test User In DB
 */

const Sequelize = require('sequelize');
const { database } = require('./config');

before(done => {
  const sequelize = new Sequelize(database.database, database.username, database.password, {
    host: database.host,
    dialect: 'mysql',
    port: database.port,
  });

  fatLog('Testing DB connection...');

  sequelize.authenticate().then(() => {
    sequelize.transaction((transaction) => {
      fatLog('Truncating DB...');

      return sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction }).then(() => {
        return sequelize.query(`
          SELECT Concat('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';')
          FROM INFORMATION_SCHEMA.TABLES
          WHERE table_schema in ('${database.database}');`,
          { transaction }
        );
      }).then((results) => {
        let truncatePromises = [];

        results[0].forEach(result => {
          Object.keys(result).forEach(key => {
            truncatePromises.push(sequelize.query(result[key], { transaction }));
          });
        });

        return Promise.all(truncatePromises);
      });
    }).then(() => {
      fatLog('Creating global test user in DB...');

      return chai.request(server).post('/users').send(testUser);
    }).then((response) => {
      testUser.accessToken = response.body.accessToken;
    }).then(() => {
      fatLog('Starting tests...');
      done();
    });
  });
});

/*
 * Helpers
 */

function fatLog(message) {
  let divider = Array(message.length + 1).join('=');

  console.log('\n');
  console.log(divider);
  console.log(message);
  console.log(divider);
  console.log('\n');
}
