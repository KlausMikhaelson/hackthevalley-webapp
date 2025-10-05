import mongoose, { Schema, model, models } from 'mongoose';

export interface IGoal {
  user_id: string; // Clerk user ID
  name: string;
  type: 'daily_spending' | 'savings' | 'custom'; // Type of goal
  target_amount: number; // Target amount (for daily spending, this is the limit)
  current_amount: number; // Current amount (for savings goals)
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one_time'; // Time period
  is_default: boolean; // Is this the default/primary goal
  created_at?: Date;
  updated_at?: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['daily_spending', 'savings', 'custom'],
      default: 'custom',
    },
    target_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    current_amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    period: {
      type: String,
      required: true,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'one_time'],
      default: 'one_time',
    },
    is_default: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user + type queries
GoalSchema.index({ user_id: 1, type: 1 });
GoalSchema.index({ user_id: 1, is_default: 1 });

const Goal = models.Goal || model<IGoal>('Goal', GoalSchema);

export default Goal;
