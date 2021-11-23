'use strict';

const { request, response } = require('express');

const Product = require('./../models/product.model.db.js');

const getProducts = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const activeProducts = { state: true };

  const [products, total] = await Promise.all([
    Product.find(activeProducts)
      .populate('user', 'name')
      .populate('category', 'name')
      .skip(+from)
      .limit(+limit),
    Product.countDocuments(activeProducts),
  ]);

  res.status(200).json({
    msg: 'Get all products',
    total,
    products,
  });
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name');

  res.status(200).json({ msg: 'GET product', product });
};

const createProduct = async (req = request, res = response) => {
  const { name, category } = req.body;

  const data = {
    name: name.toLowerCase(),
    user: req.authenticatedUser._id,
    category,
  };

  const product = new Product(data);
  await product.save();

  res.status(201).json({
    msg: 'New Product registered',
    product,
  });
};

const updateProdutc = async (req = request, res = response) => {
  const { id } = req.params;
  const newName = req.body.newName.toLowerCase();

  await Product.findByIdAndUpdate(id, { name: newName });
  const renamed = await Product.findById(id);

  res.json({
    msg: 'Update - PUT | Product updated!',
    renamed,
  });
};

const delteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const productDeleted = await Product.findByIdAndUpdate(id, {
    state: false,
  });

  res.json({
    msg: 'Delete - Delete | Product deleted!',
    productDeleted,
  });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProdutc,
  delteProduct,
};
