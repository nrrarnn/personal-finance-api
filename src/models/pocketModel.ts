import mongoose, { Schema, Document } from "mongoose";

export interface IPocket extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  budget: number;
  spent: number;
  period: "monthly" | "weekly" | "none";
}

const PocketSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },

    name: { 
      type: String, 
      required: true 
    },

    budget: { 
      type: Number, 
      default: 0 
    },

    spent: { 
      type: Number, 
      default: 0 
    },

    period: { 
      type: String,
      enum: ["monthly", "weekly", "none"],
      default: "monthly"
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPocket>("Pocket", PocketSchema);