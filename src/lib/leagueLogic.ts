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
    if (!players || players.length === 0) return [];
    
    // Get all picks
    const { data: picks, error: picksError } = await supabase
      .from('pick')
      .select('*');
    
    if (picksError) throw picksError;
    // Initialize picks as empty array if null
    const allPicks = picks || [];
    
    // Get the current week (maximum week number in picks)
    const currentWeek = allPicks.length > 0 
      ? Math.max(...allPicks.map(pick => pick.week || 0)) 
      : 0;
    
    // Calculate standings for each player
    const standingsPromises = players.map(async (player) => {
      try {
        // Filter picks for this player
        const playerPicks = allPicks.filter(pick => pick.player_id === player.id);
        
        // Calculate total points (1 point per correct pick)
        const totalPoints = playerPicks.filter(pick => pick.is_correct).length;
        
        let picksNextWeek = 1; // Default to 1
        
        try {
          // Get picks for next week
          const { data: nextWeekPicks, error: nextWeekError } = await supabase.rpc(
            'get_picks_for_next_week', 
            { player_uuid: player.id }
          );
          
          if (!nextWeekError && nextWeekPicks !== null) {
            picksNextWeek = nextWeekPicks;
          }
        } catch (err) {
          console.error(`Error getting next week picks for player ${player.name}`);
          // Continue with default value
        }
        
        // Return player standings data
        return {
          id: player.id,
          name: player.name,
          totalPoints,
          picksNextWeek,
          currentWeek: currentWeek,
          nextWeek: currentWeek + 1
        };
      } catch (playerErr) {
        console.error(`Error processing player ${player.name}`);
        // Return a default object for this player to prevent the whole Promise.all from failing
        return {
          id: player.id,
          name: player.name,
          totalPoints: 0,
          picksNextWeek: 1,
          currentWeek: currentWeek,
          nextWeek: currentWeek + 1
        };
      }
    });
    
    // Wait for all player standings to be calculated
    const standings = await Promise.all(standingsPromises);
    
    // Sort by total points (descending) - with extra safety
    if (Array.isArray(standings) && standings.length > 0) {
      return standings.sort((a, b) => {
        // Ensure totalPoints is a number
        const bPoints = typeof b.totalPoints === 'number' ? b.totalPoints : 0;
        const aPoints = typeof a.totalPoints === 'number' ? a.totalPoints : 0;
        return bPoints - aPoints;
      });
    }
    
    return standings;
  } catch (error) {
    // Log a simple message without trying to stringify the error object
    console.error('Error calculating points');
    
    // Return empty array
    return [];
  }
} 