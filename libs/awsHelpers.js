const requestPromise = require('request-promise');
const aws = require('aws-sdk');
const uuidV1 = require('uuid/v1');
const path = require('path');
const awsConfig = rootRequire('/config/aws');

function _uploadFromUrlToS3(url) {
  return requestPromise.get({
    url,
    encoding: null,
  }).then(buffer => {
    return _uploadBufferToS3(url, buffer);
  });
}

function _uploadBufferToS3(filename, buffer) {
  const s3 = new aws.S3();

  return s3.upload({
    ACL: 'public-read',
    Body: buffer,
    Bucket: awsConfig.s3AppsContentBucket,
    Key: `${uuidV1()}${path.extname(filename)}`,
  }).promise().then(result => {
    return result.Location;
  });
}

module.exports = {
  uploadFromUrlToS3: _uploadFromUrlToS3,
  uploadBufferToS3: _uploadBufferToS3,
};
