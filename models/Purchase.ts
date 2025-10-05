import mongoose, { Schema, model, models } from 'mongoose';

export interface IPurchase {
  user_id: string; // Clerk user ID
  item_name: string;
  price: number;
  currency: string;
  category: string; // Categorized by Gemini AI
  website: string;
  url?: string;
  description?: string;
  purchase_date: Date;
  metadata?: Record<string, any>; // Additional data from extension
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    user_id: {
      type: String,
      required: true,
      index: true, // Index for faster queries by user
    },
    item_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    category: {
      type: String,
      required: true,
      enum: ['food', 'fashion', 'entertainment', 'transport', 'travel', 'living', 'other'],
      default: 'other',
    },
    website: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    purchase_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound index for user + date queries
PurchaseSchema.index({ user_id: 1, purchase_date: -1 });

const Purchase = models.Purchase || model<IPurchase>('Purchase', PurchaseSchema);

export default Purchase;
