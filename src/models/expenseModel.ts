import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  amount: number;
  type: 'expense';
  category: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ExpenseSchema: Schema<IExpense> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
      maxLength: 20
    },
    type: {
      type: String,
      default: 'expense'
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      maxLength: 20,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Expense: Model<IExpense> = mongoose.model<IExpense>('Expense', ExpenseSchema);
export default Expense;
