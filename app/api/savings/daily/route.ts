import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SavedPurchase from '@/models/SavedPurchase';

/**
 * GET /api/savings/daily?user_id=xxx&date=YYYY-MM-DD
 * Get the total amount of money saved on a specific day
 * If no date provided, returns today's savings
 * 
 * Query params:
 * - user_id: string (required)
 * - date: string (optional, format: YYYY-MM-DD, default: today)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const dateParam = searchParams.get('date');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse date or use today
    let targetDate: Date;
    if (dateParam) {
      targetDate = new Date(dateParam + 'T00:00:00');
      if (isNaN(targetDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD' },
          { status: 400 }
        );
      }
    } else {
      targetDate = new Date();
      targetDate.setHours(0, 0, 0, 0);
    }

    // Get start and end of day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all saved purchases for this day
    const savedPurchases = await SavedPurchase.find({
      user_id,
      saved_date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ saved_date: -1 });

    // Calculate total saved
    const totalSaved = savedPurchases.reduce((sum, sp) => sum + sp.amount_saved, 0);

    // Group by website
    const byWebsite: Record<string, { count: number; total: number }> = {};
    savedPurchases.forEach(sp => {
      if (!byWebsite[sp.website]) {
        byWebsite[sp.website] = { count: 0, total: 0 };
      }
      byWebsite[sp.website].count++;
      byWebsite[sp.website].total += sp.amount_saved;
    });

    return NextResponse.json({
      success: true,
      date: targetDate.toISOString().split('T')[0],
      total_saved: totalSaved,
      purchases_avoided: savedPurchases.length,
      savings_breakdown: {
        by_website: Object.entries(byWebsite).map(([website, data]) => ({
          website,
          count: data.count,
          total_saved: data.total
        }))
      },
      saved_purchases: savedPurchases.map(sp => ({
        id: sp._id,
        item_name: sp.item_name,
        amount_saved: sp.amount_saved,
        website: sp.website,
        url: sp.url,
        description: sp.description,
        saved_at: sp.saved_date,
        distribution_method: sp.distribution_method
      }))
    });

  } catch (error) {
    console.error('Error in /api/savings/daily:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch daily savings' },
      { status: 500 }
    );
  }
}
