import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

/**
 * GET /api/goals/list?user_id=xxx
 * Get all goals for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get all goals for the user
    const goals = await Goal.find({ user_id }).sort({ is_default: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      goals: goals.map(goal => ({
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
      })),
    });

  } catch (error) {
    console.error('Error in /api/goals/list:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}
