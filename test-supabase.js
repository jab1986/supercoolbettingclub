const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

async function testConnection() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Check your .env file');
    return;
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test the connection by fetching players
    const { data: players, error: playersError } = await supabase
      .from('player')
      .select('*');
    
    if (playersError) {
      console.error('Error fetching players:', playersError);
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log('Players found:', players.length);
    console.log('Player data:', JSON.stringify(players, null, 2));
    
    // Test fetching picks
    const { data: picks, error: picksError } = await supabase
      .from('pick')
      .select('*');
    
    if (picksError) {
      console.error('Error fetching picks:', picksError);
      return;
    }
    
    console.log('Picks found:', picks.length);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection(); 