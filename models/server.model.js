'use strict';

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { PORT } = require('../config');
const dbConnection = require('../db/config.db');
const {
  usersRoutes,
  authRoutes,
  categoriesRoutes,
  productsRoutes,
  searchRoutes,
  uploadRoutes,
} = require('../routes');

class Server {
  constructor() {
    this.app = express();
    this.port = PORT;

    this.paths = {
      auth: '/join',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      upload: '/api/upload',
      users: '/api/users',
    };

    // Connect DB
    this.connectToDB();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async connectToDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());

    // Reading and parsing the body
    this.app.use(express.json());

    // Static directory
    this.app.use(express.static('public'));

    // Upload file
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.users, usersRoutes);
    this.app.use(this.paths.auth, authRoutes);
    this.app.use(this.paths.categories, categoriesRoutes);
    this.app.use(this.paths.products, productsRoutes);
    this.app.use(this.paths.search, searchRoutes);
    this.app.use(this.paths.upload, uploadRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server on port ${this.port}`);
    });
  }
}

module.exports = new Server();
