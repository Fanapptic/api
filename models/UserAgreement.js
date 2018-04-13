const aws = require('aws-sdk');
const hellosignSdk = require('hellosign-sdk');
const awsConfig = rootRequire('/config/aws');
const hellosignConfig = rootRequire('/config/hellosign');
const agreements = Object.keys(hellosignConfig.agreements);

const hellosign = hellosignSdk({
  key: hellosignConfig.apiKey,
});

/*
 * Model Definition
 */

const UserAgreementModel = database.define('userAgreement', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  agreement: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [agreements],
        msg: 'The agreement provided is invalid.',
      },
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  signatureRequestId: {
    type: Sequelize.STRING,
  },
  signedAgreementUrl: {
    type: Sequelize.STRING,
  },
});

/*
 * Instance Methods / Overrides
 */

UserAgreementModel.prototype.sendSignatureRequestOrReminder = function() {
  if (this.signedAgreementUrl) {
    throw new Error('This agreement has already been signed.');
  }

  return (!this.signatureRequestId) ? this._sendSignatureRequest() : this._sendSignatureReminder();
};

UserAgreementModel.prototype.getSignatureFileAndSave = function() {
  const s3 = new aws.S3();

  return hellosign.signatureRequest.download(this.signatureRequestId, {
    file_type: 'pdf',
  }).then(response => {
    return s3.upload({
      ACL: 'public-read',
      Body: response,
      Bucket: awsConfig.s3UsersBucket,
      ContentType: 'application/pdf',
      Key: `${this.userId}/releaseAgreement.pdf`,
    }).promise();
  }).then(result => {
    this.signedAgreementUrl = result.Location;

    return this.save();
  });
};

UserAgreementModel.prototype._sendSignatureRequest = function() {
  const agreementConfig = hellosignConfig.agreements[this.agreement];
  let response = null;

  return hellosign.signatureRequest.sendWithTemplate({
    test_mode: 1, // TODO: Add toggle for production vs development.
    template_id: agreementConfig.templateId,
    signers: [
      {
        email_address: this.email,
        name: 'Fanapptic User',
        role: agreementConfig.roleName,
      },
    ],
  }).then(_response => {
    response = _response;

    this.signatureRequestId = response.signature_request.signature_request_id;

    return this.save();
  }).then(() => {
    return response;
  });
};

UserAgreementModel.prototype._sendSignatureReminder = function() {
  return hellosign.signatureRequest.remind(this.signatureRequestId, {
    email_address: this.email,
  });
};

/*
 * Export
 */

module.exports = UserAgreementModel;
