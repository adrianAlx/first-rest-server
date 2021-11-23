'use strict';

const User = require('./../models/user.model.db.js');
const Product = require('./../models/product.model.db.js');

const getModel = async (collection = '', id = '') => {
  let model = {
    img: '',
  };

  if (collection === 'users') model = await User.findById(id);
  if (collection === 'products') model = await Product.findById(id);

  return model;
};

module.exports = {
  getModel,
};
