import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import usersRoutes from './routes/usersRoutes';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/users', usersRoutes);
  }
}

export default new App().app;
