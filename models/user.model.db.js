'use strict';

const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },
  email: {
    type: String,
    required: [true, 'Mail is required!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE',
    enum: ['ADMIN_ROLE', 'USER_ROLE', 'ANY_OTHER_ROLE'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.encryptPassword = async password => {
  const salt = await bcryptjs.genSalt();
  return await bcryptjs.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, state, ...userData } = this.toObject();
  userData.uid = _id;
  return userData;
};

module.exports = model('User', UserSchema);
