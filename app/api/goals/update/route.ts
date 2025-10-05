import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

/**
 * PUT /api/goals/update
 * Update a goal
 * 
 * Request body:
 * {
 *   goal_id: string;
 *   user_id: string;
 *   name?: string;
 *   target_amount?: number;
 *   current_amount?: number;
 *   is_default?: boolean;
 * }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      goal_id,
      user_id,
      name,
      target_amount,
      current_amount,
      is_default
    } = body;

    if (!goal_id || !user_id) {
      return NextResponse.json(
        { error: 'goal_id and user_id are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (target_amount !== undefined) updateData.target_amount = target_amount;
    if (current_amount !== undefined) updateData.current_amount = current_amount;
    if (is_default !== undefined) {
      updateData.is_default = is_default;
      
      // If setting as default, unset other defaults
      if (is_default) {
        await Goal.updateMany(
          { user_id, _id: { $ne: goal_id }, is_default: true },
          { $set: { is_default: false } }
        );
      }
    }

    // Update goal
    const goal = await Goal.findOneAndUpdate(
      { _id: goal_id, user_id },
      { $set: updateData },
      { new: true }
    );

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

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
      message: 'Goal updated successfully'
    });

  } catch (error) {
    console.error('Error in /api/goals/update:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update goal' },
      { status: 500 }
    );
  }
}
