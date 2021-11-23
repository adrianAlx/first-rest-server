'use strict';

const router = require('express').Router();
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers');
const { userExistAuth } = require('../helpers');
const { validateFields } = require('../middlewares');

router.post(
  '/login',
  [
    check('email', 'Email is required!').not().isEmpty(),
    check('password', 'Password is required!').not().isEmpty(),
    validateFields,
    check('email', 'The email is not valid').isEmail(),
    check('email').custom(userExistAuth),
    validateFields,
  ],
  login
);

router.post(
  '/social/google',
  [check('id_token', 'id_token is required!').not().isEmpty(), validateFields],
  googleSignIn
);

module.exports = router;
