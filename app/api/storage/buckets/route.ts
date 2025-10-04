import { NextRequest, NextResponse } from 'next/server';
import { authenticateImplicitWithAdc } from '@/lib/roasting';

export async function GET(request: NextRequest) {
  try {
    await authenticateImplicitWithAdc();
    return NextResponse.json({ 
      message: "Successfully authenticated and listed buckets. Check console for output." 
    });
  } catch (error) {
    console.error("Error in /api/storage/buckets:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
