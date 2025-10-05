import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Purchase from '@/models/Purchase';

/**
 * GET /api/purchases/list
 * Retrieve user's purchases with optional filters
 * 
 * Query parameters:
 * - limit: number (default: 50, max: 100)
 * - offset: number (default: 0)
 * - category: string (filter by category)
 * - start_date: ISO date string (filter purchases after this date)
 * - end_date: ISO date string (filter purchases before this date)
 * - sort: 'asc' | 'desc' (default: 'desc' - newest first)
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || searchParams.get('userEmail');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'user_id or userEmail query parameter is required' },
        { status: 400 }
      );
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const sort = searchParams.get('sort') === 'asc' ? 1 : -1;

    // Connect to database
    await connectDB();

    // Build query
    const query: any = { user_id: userId };
    
    if (category) {
      query.category = category;
    }

    if (start_date || end_date) {
      query.purchase_date = {};
      if (start_date) {
        query.purchase_date.$gte = new Date(start_date);
      }
      if (end_date) {
        query.purchase_date.$lte = new Date(end_date);
      }
    }

    // Execute query
    const purchases = await Purchase.find(query)
      .sort({ purchase_date: sort })
      .skip(offset)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Purchase.countDocuments(query);

    // Calculate category breakdown
    const categoryBreakdown = await Purchase.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: '$category',
          total_spent: { $sum: '$price' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate total spending
    const totalSpending = await Purchase.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      purchases: purchases.map(p => ({
        id: p._id,
        item_name: p.item_name,
        price: p.price,
        currency: p.currency,
        category: p.category,
        website: p.website,
        url: p.url,
        description: p.description,
        purchase_date: p.purchase_date,
        created_at: p.createdAt,
      })),
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
      statistics: {
        total_purchases: total,
        total_spent: totalSpending[0]?.total || 0,
        category_breakdown: categoryBreakdown.reduce((acc, item) => {
          acc[item._id] = {
            total_spent: item.total_spent,
            count: item.count,
          };
          return acc;
        }, {} as Record<string, { total_spent: number; count: number }>),
      },
    });

  } catch (error) {
    console.error('Error in /api/purchases/list:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve purchases' },
      { status: 500 }
    );
  }
}
