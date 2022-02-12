import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { resolve } from 'path';

import usersRoutes from './routes/usersRoutes';
import carsRoutes from './routes/carsRoutes';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors({ credentials: true, origin: process.env.URL_FRONTEND }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(
      '/images/',
      express.static(resolve(__dirname, 'public', 'images')),
    );
  }

  routes() {
    this.app.use('/users', usersRoutes);
    this.app.use('/cars', carsRoutes);
  }
}

export default new App().app;
