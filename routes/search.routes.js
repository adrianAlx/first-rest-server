'use strict';

const router = require('express').Router();
const { check } = require('express-validator');

const { allowedCollections } = require('../helpers');
const { validateFields, idExistSearch } = require('../middlewares');
const { searchQuery } = require('../controllers');

router.get(
  '/:collection/:query',
  [
    check('collection').custom(c =>
      allowedCollections(c, ['users', 'categories', 'products'])
    ),
    validateFields,
    idExistSearch,
    validateFields,
  ],
  searchQuery
);

module.exports = router;
