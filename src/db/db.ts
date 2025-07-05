import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const db = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('Database connected');
  } catch (error) {
    console.error('DB Connection Error', (error as Error).message);
  }
};
export default db;