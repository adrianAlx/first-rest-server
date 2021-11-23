'use strict';

const User = require('./../models/user.model.db.js');
const Role = require('./../models/role.model.db.js');
const Category = require('./../models/category.model.db.js');
const Product = require('./../models/product.model.db.js');

const isAlreadyRegistered = async (email = '') => {
  const emailExist = await User.findOne({ email });
  if (emailExist)
    throw new Error(`The email '${email}' is already registered!`);
};

const userIDExist = async (id = '') => {
  const user = await User.findById(id);
  if (!user) throw new Error(`User ID: ${id} does not exist! - in Db`);
  if (!user.state) throw new Error(`User doesn't exist - State = False`);
};

const isValidRole = async (role = '') => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist)
    throw new Error(`The role: ${role} is not valid in this app.`);
};

// Categories
const categoryIDExist = async (id = '') => {
  const category = await Category.findById(id);
  if (!category || !category.state)
    throw new Error(`Ctegory ID '${id}' doesn't exist!`);
};

// Products
const productIDExist = async (id = '') => {
  const product = await Product.findById(id);
  if (!product || !product.state)
    throw new Error(`Product ID '${id}' doesn't exist!`);
};

const productAlreadyRegis = async (name = '') => {
  const product = await Product.findOne({ name: name.toLocaleLowerCase() });

  if (product) throw new Error(`The Product '${name}' is already registered!`);
};

// allowed collections
const allowedCollections = (collection = '', collections = []) => {
  const isIncluded = collections.includes(collection);
  if (!isIncluded)
    throw new Error(`Collection '${collection}' is not allowed!`);

  return true;
};

module.exports = {
  isAlreadyRegistered,
  userIDExist,
  isValidRole,
  categoryIDExist,
  productIDExist,
  productAlreadyRegis,
  allowedCollections,
};
