import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SavedPurchase from '@/models/SavedPurchase';

/**
 * GET /api/savings/stats?user_id=xxx&period=week
 * Get savings statistics over a period
 * 
 * Query params:
 * - user_id: string (required)
 * - period: 'day' | 'week' | 'month' | 'year' | 'all' (default: 'week')
 * - start_date: string (optional, format: YYYY-MM-DD)
 * - end_date: string (optional, format: YYYY-MM-DD)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const period = searchParams.get('period') || 'week';
    const startDateParam = searchParams.get('start_date');
    const endDateParam = searchParams.get('end_date');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Calculate date range based on period
    let startDate: Date;
    let endDate: Date = new Date();

    if (startDateParam && endDateParam) {
      // Custom date range
      startDate = new Date(startDateParam + 'T00:00:00');
      endDate = new Date(endDateParam + 'T23:59:59');
    } else {
      // Predefined periods
      endDate = new Date();
      startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        case 'all':
          startDate = new Date(0); // Beginning of time
          break;
        default:
          startDate.setDate(startDate.getDate() - 7); // Default to week
      }
    }

    // Get all saved purchases in the period
    const savedPurchases = await SavedPurchase.find({
      user_id,
      saved_date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ saved_date: -1 });

    // Calculate statistics
    const totalSaved = savedPurchases.reduce((sum, sp) => sum + sp.amount_saved, 0);
    const purchasesAvoided = savedPurchases.length;

    // Group by day for trend
    const byDay: Record<string, { count: number; total: number }> = {};
    savedPurchases.forEach(sp => {
      const day = sp.saved_date.toISOString().split('T')[0];
      if (!byDay[day]) {
        byDay[day] = { count: 0, total: 0 };
      }
      byDay[day].count++;
      byDay[day].total += sp.amount_saved;
    });

    // Group by website
    const byWebsite: Record<string, { count: number; total: number; items: string[] }> = {};
    savedPurchases.forEach(sp => {
      if (!byWebsite[sp.website]) {
        byWebsite[sp.website] = { count: 0, total: 0, items: [] };
      }
      byWebsite[sp.website].count++;
      byWebsite[sp.website].total += sp.amount_saved;
      byWebsite[sp.website].items.push(sp.item_name);
    });

    // Calculate averages
    const daysInPeriod = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const avgSavedPerDay = totalSaved / daysInPeriod;
    const avgSavedPerPurchase = purchasesAvoided > 0 ? totalSaved / purchasesAvoided : 0;

    // Find biggest save
    const biggestSave = savedPurchases.length > 0 
      ? savedPurchases.reduce((max, sp) => sp.amount_saved > max.amount_saved ? sp : max)
      : null;

    // Daily trend data
    const dailyTrend = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        total_saved: data.total,
        purchases_avoided: data.count
      }));

    return NextResponse.json({
      success: true,
      period: {
        type: period,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        days: daysInPeriod
      },
      summary: {
        total_saved: totalSaved,
        purchases_avoided: purchasesAvoided,
        avg_saved_per_day: avgSavedPerDay,
        avg_saved_per_purchase: avgSavedPerPurchase,
        biggest_save: biggestSave ? {
          item_name: biggestSave.item_name,
          amount: biggestSave.amount_saved,
          website: biggestSave.website,
          date: biggestSave.saved_date
        } : null
      },
      breakdown: {
        by_website: Object.entries(byWebsite)
          .sort(([, a], [, b]) => b.total - a.total)
          .map(([website, data]) => ({
            website,
            purchases_avoided: data.count,
            total_saved: data.total,
            top_items: data.items.slice(0, 3) // Top 3 items
          })),
        daily_trend: dailyTrend
      },
      recent_saves: savedPurchases.slice(0, 10).map(sp => ({
        id: sp._id,
        item_name: sp.item_name,
        amount_saved: sp.amount_saved,
        website: sp.website,
        saved_at: sp.saved_date
      }))
    });

  } catch (error) {
    console.error('Error in /api/savings/stats:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch savings stats' },
      { status: 500 }
    );
  }
}
