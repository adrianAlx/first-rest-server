'use strict';

const { request, response } = require('express');

const User = require('./../models/user.model.db');

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const activeUsers = { state: true };

  const [users, total] = await Promise.all([
    User.find(activeUsers)
      .skip(+from)
      .limit(+limit),
    User.find(activeUsers).count(),
  ]);

  res.status(200).json({
    msg: 'Read - GET  |  Controller',
    total,
    users,
  });
};

const createUser = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const newUser = new User({ name, email, password, role });

  // Encrypt
  newUser.password = await newUser.encryptPassword(password);

  // Save in DB
  await newUser.save();

  res.status(201).json({
    msg: 'Create - POST  |  Controller',
    user: newUser,
  });
};

const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  if (req.body) return res.end();

  const { password, newPassword, google, email, ...userData } = req.body;
  const user = await User.findById(id);

  const matchPass = await user.matchPassword(password);
  if (!matchPass)
    return res.status(400).json({ msg: 'Your password was incorrect.' });

  if (newPassword) userData.password = await user.encryptPassword(newPassword);
  else return res.end();

  const newUser = await User.findByIdAndUpdate(id, userData);

  res.json({
    msg: 'User updated successfuly!',
    newUser,
  });
};

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  // // 1. Physically delete  -  Not recommended
  // const userDeleted = await User.findByIdAndDelete(id);
  // // 2. Change user state in DB
  const userDeleted = await User.findByIdAndUpdate(id, { state: false });

  res.json({
    msg: 'Deleted!',
    userDeleted,
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
