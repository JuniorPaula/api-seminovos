import 'dotenv/config';
import express from 'express';
import cors from 'cors';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {}
}

export default new App().app;
