import mongoose, { Schema, model, models } from 'mongoose';

export interface ISavedPurchase {
  user_id: string; // Clerk user ID
  item_name: string;
  amount_saved: number; // The amount that was NOT spent
  currency: string;
  website: string;
  url?: string;
  description?: string;
  saved_date: Date; // When they chose to save instead of buy
  distribution_method?: 'equal' | 'proportional' | 'priority'; // How it was distributed to goals
  goals_updated?: string[]; // IDs of goals that received money
  metadata?: Record<string, any>;
}

const SavedPurchaseSchema = new Schema<ISavedPurchase>(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    item_name: {
      type: String,
      required: true,
    },
    amount_saved: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
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
    saved_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    distribution_method: {
      type: String,
      enum: ['equal', 'proportional', 'priority'],
      required: false,
    },
    goals_updated: {
      type: [String],
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user + date queries
SavedPurchaseSchema.index({ user_id: 1, saved_date: -1 });

const SavedPurchase = models.SavedPurchase || model<ISavedPurchase>('SavedPurchase', SavedPurchaseSchema);

export default SavedPurchase;
