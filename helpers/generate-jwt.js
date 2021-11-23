'use strict';

const jwt = require('jsonwebtoken');
const { SECRETORPRIVATEKEY } = require('../config');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      SECRETORPRIVATEKEY,
      { expiresIn: '12h' },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('Sorry, the JWT culd not be generated!');
        } else resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
