import 'dotenv/config';
import mongoose from 'mongoose';

const database = async () => {
  await mongoose.connect(process.env.CONNECT_STRING);
  console.log('conectado ao mongodb.');
};

database().catch((e) => console.log(e));

export default mongoose;
