'use strict';

const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const { SECRETORPRIVATEKEY } = require('../config/index.js');
const User = require('./../models/user.model.db.js');

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token)
    return res.status(401).json({ msg: 'You have not sent a valid token' });

  try {
    const { uid } = jwt.verify(token, SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    // If they send the token and uid of a deleted user
    if (!user)
      return res.status(401).json({ msg: "User doesn't exist! - in DB" });

    if (!user.state)
      return res
        .status(401)
        .json({ msg: "User doesn't exist! - in DB OR State = False" });

    req.authenticatedUser = user;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: 'Invalid token!',
    });
  }
};

module.exports = {
  validateJWT,
};
