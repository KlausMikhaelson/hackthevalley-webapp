import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import { categorizePurchase } from '@/lib/categorization';

/**
 * POST /api/purchases/add
 * Add a new purchase to the user's database with AI categorization
 * 
 * Request body:
 * {
 *   item_name: string;
 *   price: number;
 *   currency?: string; // default: 'USD'
 *   website: string;
 *   url?: string;
 *   description?: string;
 *   purchase_date?: string; // ISO date string
 *   metadata?: Record<string, any>;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body first
    const body = await request.json();
    
    // Get user_id from body (required for all requests now)
    const userId = body.user_id || body.userEmail; // Support both user_id and userEmail
    
    if (!userId) {
      return NextResponse.json(
        { error: 'user_id or userEmail is required' },
        { status: 400 }
      );
    }
    const {
      item_name,
      price,
      currency = 'USD',
      website,
      url,
      description,
      purchase_date,
      metadata
    } = body;

    // Validate required fields
    if (!item_name || !price || !website) {
      return NextResponse.json(
        { error: 'Missing required fields: item_name, price, website' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Categorize the item using Gemini AI
    const category = await categorizePurchase(item_name, description);

    // Connect to database
    await connectDB();

    // Create purchase record
    const purchase = await Purchase.create({
      user_id: userId,
      item_name,
      price,
      currency,
      category,
      website,
      url,
      description,
      purchase_date: purchase_date ? new Date(purchase_date) : new Date(),
      metadata,
    });

    return NextResponse.json({
      success: true,
      purchase: {
        id: purchase._id,
        item_name: purchase.item_name,
        price: purchase.price,
        currency: purchase.currency,
        category: purchase.category,
        website: purchase.website,
        url: purchase.url,
        description: purchase.description,
        purchase_date: purchase.purchase_date,
        created_at: purchase.createdAt,
      },
      message: 'Purchase added successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in /api/purchases/add:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add purchase' },
      { status: 500 }
    );
  }
}
