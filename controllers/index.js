'use strict';

const usersController = require('./users.controller.js');
const authController = require('./auth.controller.js');
const categoriesController = require('./categories.controller.js');
const productsController = require('./products.controller.js');
const searchController = require('./search.controller.js');
const uploadController = require('./upload.controller.js');

module.exports = {
  ...usersController,
  ...authController,
  ...categoriesController,
  ...productsController,
  ...searchController,
  ...uploadController,
};
