'use strict';

const path = require('path');
const uuidv4 = require('uuid').v4;

const uploadFile = (files, directory = '') => {
  return new Promise((resolve, reject) => {
    // console.log(files);

    const { file } = files;
    const fileExtension = file.name.split('.').at(-1);

    // Upload file
    const fileName = uuidv4() + '.' + fileExtension;
    const uploadPath = path.join(
      __dirname,
      './../uploads',
      directory,
      fileName
    );

    file.mv(uploadPath, err => {
      if (err) reject(err);
      resolve(fileName);
    });
  });
};

module.exports = {
  uploadFile,
};
