'use strict';

const dbValidator = require('./db-validators.js');
const authHelpers = require('./auth.js');
const generateJWT = require('./generate-jwt.js');
const socialVerify = require('./social-verify.js');
const uploadFile = require('./upload-file.js');
const getModel = require('./getModelUpload.js');

module.exports = {
  ...dbValidator,
  ...authHelpers,
  ...generateJWT,
  ...socialVerify,
  ...uploadFile,
  ...getModel,
};
