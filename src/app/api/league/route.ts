import { NextResponse } from 'next/server';
import { calculatePoints } from '../../../lib/leagueLogic';

/**
 * GET /api/league
 * Fetches the current league standings
 */
export async function GET() {
  try {
    // Calculate all player points and standings
    const standings = await calculatePoints();
    
    return NextResponse.json({ 
      standings,
      success: true
    });
  } catch (error) {
    console.error('League data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch league data', success: false },
      { status: 500 }
    );
  }
} 