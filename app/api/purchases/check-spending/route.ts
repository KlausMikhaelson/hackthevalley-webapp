import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Goal from '@/models/Goal';
import { roast } from '@/lib/roasting';

/**
 * POST /api/purchases/check-spending
 * Check if a purchase would exceed the user's daily spending goal
 * If overspending, return a roast message
 * 
 * Request body:
 * {
 *   user_id: string;
 *   item_name: string;
 *   price: number;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, item_name, price } = body;

    if (!user_id || !item_name || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, item_name, price' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user's default daily spending goal
    const dailyGoal = await Goal.findOne({
      user_id,
      type: 'daily_spending',
      is_default: true
    });

    if (!dailyGoal) {
      // No goal set, allow purchase
      return NextResponse.json({
        success: true,
        can_purchase: true,
        message: 'No spending goal set',
        daily_limit: 0,
        spent_today: 0,
        remaining: 0,
        new_total: price
      });
    }

    // Get today's date range (start and end of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Calculate total spent today
    const todaysPurchases = await Purchase.find({
      user_id,
      purchase_date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const spentToday = todaysPurchases.reduce((sum, purchase) => sum + purchase.price, 0);
    const dailyLimit = dailyGoal.target_amount;
    const remaining = dailyLimit - spentToday;
    const newTotal = spentToday + price;

    // Check if this purchase would exceed the limit
    const isOverspending = newTotal > dailyLimit;

    let roastMessage = null;
    if (isOverspending) {
      // Get all user's goals for context
      const allGoals = await Goal.find({ user_id });
      
      // Format items for roast
      const items: Record<string, string> = {
        [item_name]: `$${price.toFixed(2)}`
      };

      // Format goals for roast
      const goals: Record<string, [string, string]> = {};
      allGoals.forEach(goal => {
        if (goal.type === 'savings') {
          goals[goal.name] = [
            `save $${goal.target_amount}`,
            goal.period
          ];
        }
      });

      // Call roast API
      try {
        roastMessage = await roast(
          items,
          `$${dailyLimit.toFixed(2)}`,
          goals
        );
      } catch (error) {
        console.error('Error calling roast:', error);
        roastMessage = `You're about to spend $${price.toFixed(2)} on ${item_name}, which would put you at $${newTotal.toFixed(2)} for today. Your daily limit is $${dailyLimit.toFixed(2)}. That's $${(newTotal - dailyLimit).toFixed(2)} over budget! Maybe reconsider this purchase?`;
      }
    }

    return NextResponse.json({
      success: true,
      can_purchase: !isOverspending,
      is_overspending: isOverspending,
      daily_limit: dailyLimit,
      spent_today: spentToday,
      remaining: remaining,
      new_total: newTotal,
      overspend_amount: isOverspending ? newTotal - dailyLimit : 0,
      roast_message: roastMessage,
      message: isOverspending 
        ? 'This purchase would exceed your daily spending limit'
        : 'Purchase is within your daily spending limit'
    });

  } catch (error) {
    console.error('Error in /api/purchases/check-spending:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check spending' },
      { status: 500 }
    );
  }
}
