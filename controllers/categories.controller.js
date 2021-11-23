'use strict';

const { request, response } = require('express');

const Category = require('../models/category.model.db.js');

// Pagination - total - .populate()
const getCategories = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const activeCategories = { state: true };

  const [allCategories, total] = await Promise.all([
    Category.find(activeCategories)
      .populate('user', 'name')
      .skip(+from - 2)
      .limit(+limit),
    Category.countDocuments(activeCategories),
  ]);

  res.status(200).json({
    msg: 'Read - GET | Categories',
    total,
    allCategories,
  });
};

const getCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate('user', 'name');

  res.status(200).json({
    msg: 'Read - GET | Category',
    category,
  });
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const category = await Category.findOne({ name });
  if (category)
    return res.status(400).json({
      msg: `Category '${name}' already exists.`,
    });

  const data = {
    name,
    user: req.authenticatedUser._id,
  };

  const newCategory = await new Category(data);

  await newCategory.save();

  res.status(201).json({
    msg: 'Create - POST | Category Created!',
    newCategory,
  });
};

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const { newName } = req.body;

  await Category.findByIdAndUpdate(id, { name: newName });
  const renamed = await Category.findById(id);

  res.json({
    msg: 'Update - PUT | Category updated!',
    categoryID: id,
    renamed,
  });
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const categoryDeleted = await Category.findByIdAndUpdate(id, {
    state: false,
  });

  res.json({
    msg: 'Delete - Delete | Category deleted!',
    categoryDeleted,
  });
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
