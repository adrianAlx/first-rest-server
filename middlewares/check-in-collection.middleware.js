'use strict';
const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Category = require('../models/category.model.db.js');
const Product = require('../models/product.model.db.js');
const User = require('../models/user.model.db.js');

const categoryIDNameExist = async (req = request, res = response, next) => {
  const { id } = req.params;
  const { newName } = req.body;

  const category = await Category.findById(id);

  if (!category || !category.state)
    return res.status(400).json({ msg: `Ctegory ID '${id}' doesn't exist!` });

  // 'Cause it's not necessary to update/delete
  if (!newName) return next();
  const categoryName = await Category.findOne({ name: newName.toUpperCase() });

  if (newName.toUpperCase() === category.name)
    return res.status(400).json({ msg: 'New name must not be the same!' });

  if (categoryName)
    return res
      .status(400)
      .json({ msg: `Category '${newName}' already exists!` });

  next();
};

const checkNewNameProduct = async (req = request, res = response, next) => {
  const { id } = req.params;
  const newName = req.body.newName.toLowerCase();

  const productName = await Product.findOne({ name: newName.toLowerCase() });
  const product = await Product.findById(id);

  if (product.name === newName.toLowerCase())
    return res.status(400).json({ msg: 'New name must not be the same!' });

  if (productName)
    return res
      .status(400)
      .json({ msg: `The Product '${newName}' is already registered!` });

  next();
};

const idExistSearch = async (req = request, res = response, next) => {
  const { collection, query } = req.params;
  const isValidMongoId = ObjectId.isValid(query);
  if (!isValidMongoId) return next();

  let model;

  const checkInCollection = () =>
    res.json({
      results: model && model.state ? [model] : [],
    });

  switch (collection) {
    case 'users':
      model = await User.findById(query);
      return checkInCollection();

    case 'categories':
      model = await Category.findById(query);
      return checkInCollection();

    case 'products':
      model = await Product.findById(query).populate('category', 'name');

    default:
      break;
  }
};

const idExistUpload = async (req = request, res = response, next) => {
  const { collection, id } = req.params;
  let model;

  const checkInCollection = () => {
    if (!model || !model.state)
      return res
        .status(400)
        .json({ msg: `${collection} ID '${id}' doesn't exist!` });

    return next();
  };

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      return checkInCollection();

    case 'products':
      model = await User.findById(id);
      return checkInCollection();

    default:
      break;
  }
};

module.exports = {
  categoryIDNameExist,
  checkNewNameProduct,
  idExistSearch,
  idExistUpload,
};
