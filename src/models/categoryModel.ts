import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  icon: string;
  type: 'income' | 'expense';
  userId: mongoose.Types.ObjectId;
}

const CategorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
