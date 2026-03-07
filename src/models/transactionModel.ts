import mongoose, { Schema, Document, Types } from 'mongoose';
import { ICategory } from './categoryModel';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: Types.ObjectId | ICategory;
  date: Date;
  pocketId?: Types.ObjectId;
  description?: string;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, 
  type: { type: String, enum: ['income', 'expense'], required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, default: Date.now, index: true }, 
  pocketId: { type: Schema.Types.ObjectId, ref: 'Pocket', required: false },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);