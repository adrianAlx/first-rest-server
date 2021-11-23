'use strict';

const router = require('express').Router();
const { check } = require('express-validator');

const {
  validateFields,
  validateJWT,
  // isAdminOrSameUser,
  hasValidRole,
} = require('../middlewares');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('./../controllers');
const {
  isAlreadyRegistered,
  userIDExist,
  isValidRole,
} = require('./../helpers');

router.get('/', [validateJWT, validateFields], getUsers);

router.post(
  '/',
  [
    check('name', 'Name is required.').not().isEmpty(),
    check(
      'password',
      'The password must be longer than 6 characters.'
    ).isLength({ min: 6 }),
    check('email', 'The email is not valid!').isEmail(),
    check('email').custom(isAlreadyRegistered),
    check('role').custom(isValidRole),
    validateFields,
  ],
  createUser
);

router.put(
  '/:id',
  [
    check('id', 'The ID is not a valid MongoDB ID').isMongoId(),
    check('id').custom(userIDExist),
    validateFields,
  ],
  updateUser
);

router.delete(
  '/:id',
  [
    validateJWT,
    // isAdminOrSameUser,
    hasValidRole('ADMIN_ROLE', 'ANY_OTHER_ROLE'),
    check('id', 'ID is not a valid MongoDB ID!').isMongoId(),
    validateFields,
    check('id').custom(userIDExist),
    validateFields,
  ],
  deleteUser
);

module.exports = router;
