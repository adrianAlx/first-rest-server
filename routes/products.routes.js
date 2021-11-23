'use strict';

const router = require('express').Router();
const { check } = require('express-validator');

const {
  validateFields,
  validateJWT,
  isAdmin,
  checkNewNameProduct,
} = require('../middlewares');
const {
  categoryIDExist,
  productAlreadyRegis,
  productIDExist,
} = require('../helpers');
const {
  getProducts,
  createProduct,
  getProduct,
  updateProdutc,
  delteProduct,
} = require('../controllers');

router.get('/', getProducts);

router.get(
  '/:id',
  [
    check('id', 'It is not a valid Mongo ID').isMongoId(),
    validateFields,
    check('id').custom(productIDExist),
    validateFields,
  ],
  getProduct
);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'Product name is required!').not().isEmpty(),
    check('category', 'Category is required!').not().isEmpty(),
    check('category', 'It is not a valid Mongo ID').isMongoId(),
    validateFields,
    check('category').custom(categoryIDExist),
    validateFields,
    check('name').custom(productAlreadyRegis),
    validateFields,
  ],
  createProduct
);

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Invalid ID!').isMongoId(),
    check('newName', 'New name is required!').not().isEmpty(),
    validateFields,
    check('id').custom(productIDExist),
    validateFields,
    checkNewNameProduct,
  ],
  updateProdutc
);

router.delete(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'Invalid ID').isMongoId(),
    validateFields,
    check('id').custom(productIDExist),
    validateFields,
  ],
  delteProduct
);

module.exports = router;
