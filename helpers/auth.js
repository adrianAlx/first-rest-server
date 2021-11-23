'use strict';

const User = require('./../models/user.model.db.js');

const userExistAuth = async (email = '') => {
  const user = await User.findOne({ email });
  if (!user)
    throw new Error(
      `There was a problem logging in. Check your email and password or create an account.`
    );
  if (!user.state)
    throw new Error(
      `There was a problem logging in. Check your email and password or create an account.  - State = False`
    );
};

module.exports = {
  userExistAuth,
};
