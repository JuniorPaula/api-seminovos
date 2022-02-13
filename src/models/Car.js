import mongoose from '../config/database';
import { Schema } from 'mongoose';

const Car = mongoose.model(
  'Car',
  new Schema(
    {
      model: { type: String, required: true },
      brand: { type: String, required: true },
      color: { type: String, required: true },
      description: { type: String, required: true },
      km: { type: Number, required: true },
      year: { type: Number, required: true },
      price: { type: Number, required: true },
      images: { type: Array, required: true },
      available: { type: Boolean },
      user: Object,
      buyer: Object,
    },
    { timestamps: true },
  ),
);

export default Car;
