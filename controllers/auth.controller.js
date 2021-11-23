'use strict';

const { request, response } = require('express');

const { generateJWT, googleVerify } = require('../helpers');
const User = require('../models/user.model.db.js');

const login = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check password
    const matchPass = await user.matchPassword(password);
    if (!matchPass)
      return res.status(400).json({
        msg: 'There was a problem logging in. Check your email and password or create an account. - Incorrect Pass',
      });

    // Generate JWT
    const token = await generateJWT(user._id);

    res.json({ msg: 'Log In - Ok', user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Something went wrong!' });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: 'Not applicable',
        img,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    // User exists, but state = false
    if (!user.state)
      return res.status(401).json({ msg: 'User blocked, talk to admin.' });

    const token = await generateJWT(user.id);

    res.json({ msg: 'OK papu', user, token });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, msg: 'Token could not be verified!' });
  }
};

module.exports = {
  login,
  googleSignIn,
};
