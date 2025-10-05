import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';
import SavedPurchase from '@/models/SavedPurchase';

/**
 * POST /api/goals/add-savings
 * Add saved money to all user's goals
 * Called when user clicks "I'll save" in the browser extension
 * 
 * Request body:
 * {
 *   user_id: string;
 *   amount: number;
 *   distribution?: 'equal' | 'proportional' | 'priority'; // default: 'equal'
 *   item_name?: string; // What they didn't buy
 *   website?: string; // Where they didn't buy it
 *   url?: string; // Product URL
 *   description?: string; // Product description
 * }
 * 
 * Distribution methods:
 * - equal: Split amount equally across all goals
 * - proportional: Distribute based on target amounts (bigger goals get more)
 * - priority: Give all to default goal, or split if no default
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id, 
      amount, 
      distribution = 'equal',
      item_name,
      website,
      url,
      description
    } = body;

    if (!user_id || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, amount' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get all savings goals for the user (excluding daily_spending goals)
    const goals = await Goal.find({
      user_id,
      type: { $in: ['savings', 'custom'] } // Only savings and custom goals
    });

    if (goals.length === 0) {
      return NextResponse.json(
        { error: 'No savings goals found for this user' },
        { status: 404 }
      );
    }

    let updatedGoals: any[] = [];

    // Distribute the saved amount based on the distribution method
    switch (distribution) {
      case 'priority': {
        // Give all to default goal, or split equally if no default
        const defaultGoal = goals.find(g => g.is_default);
        
        if (defaultGoal) {
          defaultGoal.current_amount += amount;
          await defaultGoal.save();
          updatedGoals = [defaultGoal];
        } else {
          // No default, fall back to equal distribution
          const amountPerGoal = amount / goals.length;
          for (const goal of goals) {
            goal.current_amount += amountPerGoal;
            await goal.save();
            updatedGoals.push(goal);
          }
        }
        break;
      }

      case 'proportional': {
        // Distribute based on target amounts
        const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
        
        for (const goal of goals) {
          const proportion = goal.target_amount / totalTarget;
          const goalAmount = amount * proportion;
          goal.current_amount += goalAmount;
          await goal.save();
          updatedGoals.push(goal);
        }
        break;
      }

      case 'equal':
      default: {
        // Split equally across all goals
        const amountPerGoal = amount / goals.length;
        
        for (const goal of goals) {
          goal.current_amount += amountPerGoal;
          await goal.save();
          updatedGoals.push(goal);
        }
        break;
      }
    }

    // Record the saved purchase
    const savedPurchase = await SavedPurchase.create({
      user_id,
      item_name: item_name || 'Unknown Item',
      amount_saved: amount,
      currency: 'USD',
      website: website || 'Unknown',
      url,
      description,
      saved_date: new Date(),
      distribution_method: distribution,
      goals_updated: updatedGoals.map(g => g._id.toString()),
    });

    return NextResponse.json({
      success: true,
      message: `Successfully added $${amount.toFixed(2)} to ${updatedGoals.length} goal(s)`,
      distribution_method: distribution,
      total_amount: amount,
      saved_purchase_id: savedPurchase._id,
      goals_updated: updatedGoals.map(g => ({
        id: g._id,
        name: g.name,
        previous_amount: g.current_amount - (distribution === 'proportional' 
          ? amount * (g.target_amount / goals.reduce((sum, goal) => sum + goal.target_amount, 0))
          : amount / goals.length),
        new_amount: g.current_amount,
        amount_added: distribution === 'proportional'
          ? amount * (g.target_amount / goals.reduce((sum, goal) => sum + goal.target_amount, 0))
          : amount / goals.length,
        target_amount: g.target_amount,
        progress_percentage: Math.min((g.current_amount / g.target_amount) * 100, 100).toFixed(2)
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/goals/add-savings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add savings' },
      { status: 500 }
    );
  }
}
