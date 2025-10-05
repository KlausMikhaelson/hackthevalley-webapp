import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

/**
 * POST /api/goals/create
 * Create a new goal for a user
 * 
 * Request body:
 * {
 *   user_id: string;
 *   name: string;
 *   type: 'daily_spending' | 'savings' | 'custom';
 *   target_amount: number;
 *   current_amount?: number;
 *   period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one_time';
 *   is_default?: boolean;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      name,
      type,
      target_amount,
      current_amount = 0,
      period,
      is_default = false
    } = body;

    // Validate required fields
    if (!user_id || !name || !type || !target_amount || !period) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, name, type, target_amount, period' },
        { status: 400 }
      );
    }

    if (typeof target_amount !== 'number' || target_amount < 0) {
      return NextResponse.json(
        { error: 'target_amount must be a positive number' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // If setting as default, unset other defaults for this user
    if (is_default) {
      await Goal.updateMany(
        { user_id, is_default: true },
        { $set: { is_default: false } }
      );
    }

    // Create goal
    const goal = await Goal.create({
      user_id,
      name,
      type,
      target_amount,
      current_amount,
      period,
      is_default,
    });

    return NextResponse.json({
      success: true,
      goal: {
        id: goal._id,
        user_id: goal.user_id,
        name: goal.name,
        type: goal.type,
        target_amount: goal.target_amount,
        current_amount: goal.current_amount,
        period: goal.period,
        is_default: goal.is_default,
        created_at: goal.createdAt,
        updated_at: goal.updatedAt,
      },
      message: 'Goal created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in /api/goals/create:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create goal' },
      { status: 500 }
    );
  }
}
