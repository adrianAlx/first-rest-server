'use strict';

const { request, response } = require('express');

const isAdmin = (req = request, res = response, next) => {
  if (!req.authenticatedUser)
    return res.status(401).json({ msg: 'Unathorized!' });

  const { role, name } = req.authenticatedUser;

  if (role !== 'ADMIN_ROLE')
    return res
      .status(402)
      .json({ msg: `'${name}' is not an admin. - He can't do it.` });

  next();
};

const isAdminOrSameUser = (req = request, res = response, next) => {
  if (!req.authenticatedUser)
    return res.status(401).json({ msg: 'Unathorized!' });

  const { id } = req.params;
  const { role, name, _id: uid } = req.authenticatedUser;

  if (id === uid.toString()) return next();

  if (role !== 'ADMIN_ROLE')
    return res.status(401).json({
      msg: `Unauthorized! - '${name}' is not an admin or the same user. He can't do it`,
    });

  next();
};

const hasValidRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.authenticatedUser)
      return res.status(401).json({
        msg: 'Unathorized! - You want to verify the role without validating the token first',
      });

    const { id } = req.params;
    const { role, name, _id: uid } = req.authenticatedUser;
    if (id === uid.toString()) return next();

    if (!roles.includes(role))
      return res
        .status(401)
        .json({ msg: `Unauthorized! - '${name}' has no valid role!` });

    next();
  };
};

module.exports = {
  isAdmin,
  isAdminOrSameUser,
  hasValidRole,
};
