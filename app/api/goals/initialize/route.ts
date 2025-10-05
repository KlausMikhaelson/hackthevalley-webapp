import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

/**
 * POST /api/goals/initialize
 * Initialize default goal for a new user (spend less than $100 daily)
 * 
 * Request body:
 * {
 *   user_id: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already has a default daily spending goal
    const existingGoal = await Goal.findOne({
      user_id,
      type: 'daily_spending',
      is_default: true
    });

    if (existingGoal) {
      return NextResponse.json({
        success: true,
        goal: {
          id: existingGoal._id,
          user_id: existingGoal.user_id,
          name: existingGoal.name,
          type: existingGoal.type,
          target_amount: existingGoal.target_amount,
          current_amount: existingGoal.current_amount,
          period: existingGoal.period,
          is_default: existingGoal.is_default,
          created_at: existingGoal.createdAt,
          updated_at: existingGoal.updatedAt,
        },
        message: 'User already has a default goal'
      });
    }

    // Create default daily spending goal
    const goal = await Goal.create({
      user_id,
      name: 'Daily Spending Limit',
      type: 'daily_spending',
      target_amount: 100, // Default $100 daily limit
      current_amount: 0,
      period: 'daily',
      is_default: true,
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
      message: 'Default goal created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in /api/goals/initialize:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize goal' },
      { status: 500 }
    );
  }
}
