import { Schema, model, Document, Types } from 'mongoose';

export interface IIncome extends Document {
  title: string;
  amount: number;
  type?: string;
  category: string;
  description: string;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const IncomeSchema = new Schema<IIncome>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
      max: 999999999999999, 
    },
    type: {
      type: String,
      default: 'income',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IIncome>('Income', IncomeSchema);