import { supabase } from './supabaseClient';
import { Database } from './database.types';

type Player = Database['public']['Tables']['player']['Row'];
type Pick = Database['public']['Tables']['pick']['Row'];

/**
 * Calculate league standings with total points and next week picks
 */
export async function calculatePoints() {
  try {
    // Get all players
    const { data: players, error: playersError } = await supabase
      .from('player')
      .select('*');
    
    if (playersError) throw playersError;
    if (!players) return [];
    
    // Get all picks
    const { data: picks, error: picksError } = await supabase
      .from('pick')
      .select('*');
    
    if (picksError) throw picksError;
    if (!picks) return [];
    
    // Get the current week (maximum week number in picks)
    const currentWeek = picks.length > 0 
      ? Math.max(...picks.map(pick => pick.week)) 
      : 0;
    
    // Calculate standings for each player
    const standings = await Promise.all(players.map(async (player) => {
      // Filter picks for this player
      const playerPicks = picks.filter(pick => pick.player_id === player.id);
      
      // Calculate total points (1 point per correct pick)
      const totalPoints = playerPicks.filter(pick => pick.is_correct).length;
      
      // Get picks for next week
      const { data: nextWeekPicks } = await supabase.rpc(
        'get_picks_for_next_week', 
        { player_uuid: player.id }
      );
      
      // Return player standings data
      return {
        id: player.id,
        name: player.name,
        totalPoints,
        picksNextWeek: nextWeekPicks || 1, // Default to 1 if no data
        currentWeek: currentWeek,
        nextWeek: currentWeek + 1
      };
    }));
    
    // Sort by total points (descending)
    return standings.sort((a, b) => b.totalPoints - a.totalPoints);
  } catch (error) {
    console.error('Error calculating points:', error);
    return [];
  }
} 