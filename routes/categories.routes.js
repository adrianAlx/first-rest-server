'use strict';

const router = require('express').Router();
const { check } = require('express-validator');

const {
  validateFields,
  categoryIDNameExist,
  validateJWT,
  isAdmin,
} = require('../middlewares');
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers');

// Get all categories - public
router.get('/', getCategories);

// Get a category by ID - public
router.get(
  '/:id',
  [
    check('id', 'ID is not a valid MongoDB ID!').isMongoId(),
    validateFields,
    categoryIDNameExist,
    validateFields,
  ],
  getCategory
);

// Create a new category - private for any valid role
router.post(
  '/',
  [
    validateJWT,
    check('name', 'Product name is required!').not().isEmpty(),
    validateFields,
  ],
  createCategory
);

// Update a category by ID - private - for any valid role
router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Invalid ID!').isMongoId(),
    check('newName', 'New name is required!').not().isEmpty(),
    validateFields,
    categoryIDNameExist,
    validateFields,
  ],
  updateCategory
);

// Delete a category - private - only for Admin  <--  state: false
router.delete(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'Invalid ID!').isMongoId(),
    validateFields,
    categoryIDNameExist,
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
