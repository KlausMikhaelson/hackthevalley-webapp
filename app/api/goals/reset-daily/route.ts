import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

/**
 * POST /api/goals/reset-daily
 * Reset daily spending goals' current_amount to 0
 * This should be called at the start of each day (can be triggered by cron or user login)
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

    // Reset all daily spending goals for the user
    const result = await Goal.updateMany(
      {
        user_id,
        type: 'daily_spending',
        period: 'daily'
      },
      {
        $set: { current_amount: 0 }
      }
    );

    return NextResponse.json({
      success: true,
      reset_count: result.modifiedCount,
      message: `Reset ${result.modifiedCount} daily spending goal(s)`
    });

  } catch (error) {
    console.error('Error in /api/goals/reset-daily:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset daily goals' },
      { status: 500 }
    );
  }
}
