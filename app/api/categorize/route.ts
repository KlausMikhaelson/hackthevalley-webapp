import { NextRequest, NextResponse } from 'next/server';
import { categorize } from '@/lib/roasting';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;
    
    if (!items) {
      return NextResponse.json(
        { error: "Missing required field: items" },
        { status: 400 }
      );
    }
    
    const categories = await categorize(items);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error in /api/categorize:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
