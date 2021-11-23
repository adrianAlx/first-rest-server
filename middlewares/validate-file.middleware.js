'use strict';

const { response, request } = require('express');

const validateFile = (req, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file)
    return res
      .status(400)
      .json({ msg: 'No file has been selected. - validateFile()' });

  // console.log('req.files >>>', req.files); // express-fileupload

  next();
};

const validateFileExts = (allowedExts = []) => {
  return (req = request, res = response, next) => {
    const { file } = req.files;
    const fileExtension = file.name.split('.').at(-1);

    if (!allowedExts.includes(fileExtension))
      return res
        .status(400)
        .json({ msg: `File not allowed: '.${fileExtension}' isn't allowed!` });

    next();
  };
};

module.exports = {
  validateFile,
  validateFileExts,
};
