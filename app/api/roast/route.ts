import { NextRequest, NextResponse } from 'next/server';
import { roast } from '@/lib/roasting';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, amount, goals } = body;
    
    if (!items || !amount || !goals) {
      return NextResponse.json(
        { error: "Missing required fields: items, amount, goals" },
        { status: 400 }
      );
    }
    
    const result = await roast(items, amount, goals);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in /api/roast:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
