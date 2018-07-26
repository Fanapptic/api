const requestPromise = require('request-promise');
const aws = require('aws-sdk');
const uuidV1 = require('uuid/v1');
const path = require('path');
const awsConfig = rootRequire('/config/aws');

module.exports = {
  uploadFromUrlToS3: function(url) {
    const s3 = new aws.S3();

    return requestPromise.get({
      url,
      encoding: null,
    }).then(buffer => {
      return s3.upload({
        ACL: 'public-read',
        Body: buffer,
        Bucket: awsConfig.s3AppsContentBucket,
        Key: `${uuidV1()}${path.extname(url)}`,
      }).promise();
    }).then(result => {
      return result.Location;
    });
  },
};
