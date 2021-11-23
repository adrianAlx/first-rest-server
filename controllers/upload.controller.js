'use strict';

const { request, response } = require('express');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const { uploadFile, getModel } = require('../helpers');
const { CLOUDINARY_URL } = require('../config');

cloudinary.config(CLOUDINARY_URL);

const uploadFileController = async (req = request, res = response) => {
  try {
    const fileName = await uploadFile(req.files, 'textFiles');
    // const fileName = await uploadFile(req.files, 'pdf');
    // const fileName = await uploadFile(req.files, 'images');

    res.status(201).json({ fileName });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

const serveImg = async (req = request, res = response) => {
  const { collection, id } = req.params;
  const placeholder = path.join(__dirname, './../assets/nope-not-here.png');

  const model = await getModel(collection, id);

  // Get img path
  if (model.img) {
    const imgPath = path.join(__dirname, './../uploads', collection, model.img);
    if (fs.existsSync(imgPath)) return res.sendFile(imgPath);

    return res.status(200).json({ ImgUrl: model.img });
  }

  res.sendFile(placeholder);
};

const updateImg = async (req = request, res = response) => {
  const { collection, id } = req.params;

  const model = await getModel(collection, id);

  // Delete previous images
  if (model.img) {
    const imgPath = path.join(__dirname, './../uploads', collection, model.img);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  // Upload new image
  try {
    const fileName = await uploadFile(req.files, collection);
    model.img = fileName;
    await model.save();

    res.json({
      msg: 'Updated!',
      model,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const updateImgCloudinary = async (req = request, res = response) => {
  const { collection, id } = req.params;

  const model = await getModel(collection, id);

  // Delete previous images
  if (model.img) {
    const arrName = model.img.split('/');
    const [public_id] = arrName.at(-1).split('.');
    cloudinary.uploader.destroy(public_id);
  }

  // Upload img
  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json({
    msg: 'Updated!',
    model,
  });
};

module.exports = {
  uploadFileController,
  serveImg,
  updateImg,
  updateImgCloudinary,
};
