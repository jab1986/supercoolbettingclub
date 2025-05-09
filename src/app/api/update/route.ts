import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validate request schema
const updateSchema = z.object({
  week: z.number().int().positive(),
  picks: z.array(
    z.object({
      playerId: z.string().uuid(),
      selection: z.string().min(1),
      isCorrect: z.boolean()
    })
  )
});

type UpdateRequest = z.infer<typeof updateSchema>;

/**
 * POST /api/update
 * Submit weekly picks/results
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate data
    const validationResult = updateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid data', 
          details: validationResult.error.issues,
          success: false 
        },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Create Supabase server client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          }
        }
      }
    );
    
    // Verify user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }
    
    // Prepare batch insert data
    const picksToInsert = data.picks.map(pick => ({
      player_id: pick.playerId,
      week: data.week,
      selection: pick.selection,
      is_correct: pick.isCorrect
    }));
    
    // Insert picks in a transaction
    const { error } = await supabase.from('pick').upsert(
      picksToInsert,
      { onConflict: 'player_id,week,selection' }
    );
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update picks', success: false },
      { status: 500 }
    );
  }
} 