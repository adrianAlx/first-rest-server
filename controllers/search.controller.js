'use strict';

const { request, response } = require('express');

const User = require('./../models/user.model.db.js');
const Category = require('./../models/category.model.db.js');
const Product = require('./../models/product.model.db.js');

const genRegex = (query = '') => new RegExp(query, 'i');

const searchUsers = async (query = '', res = response) => {
  const users = await User.find({
    $or: [{ name: genRegex(query) }, { email: genRegex(query) }],
    $and: [{ state: true }],
  });

  res.json({
    results: users,
  });
};

const searchCategories = async (query = '', res = response) => {
  const category = await Category.find({
    name: genRegex(query),
    state: true,
  });

  res.json({ results: category });
};

const searchProducts = async (query = '', res = response) => {
  const product = await Product.find({
    name: genRegex(query),
    state: true,
  }).populate('category', 'name');

  res.json({ results: product });
};

const searchQuery = (req = request, res = response) => {
  const { collection, query } = req.params;

  switch (collection) {
    case 'users':
      searchUsers(query, res);
      break;
    case 'category':
      searchCategories(query, res);
      break;
    case 'products':
      searchProducts(query, res);
      break;
    case 'roles':
      break;
    default:
      res.status(500).json({ msg: 'Something went wrong!' });
  }
};

module.exports = {
  searchQuery,
};
