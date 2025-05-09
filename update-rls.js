const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env file');
  process.exit(1);
}

console.log('Note: This script can only be run with admin/service role key. Using the anon key will fail.');
console.log('Please enable row security in the Supabase dashboard if this fails:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to the Database > Tables section');
console.log('3. For both "player" and "pick" tables, edit the RLS policies');
console.log('4. Add policy for SELECT that allows public access');
console.log('Example policy: (true) WITH CHECK (true)');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRead() {
  try {
    console.log('Testing read access...');
    
    // Test reading players
    const { data: players, error: playerError } = await supabase
      .from('player')
      .select('*');
      
    if (playerError) {
      console.error('Error reading players:', playerError);
    } else {
      console.log(`Successfully read ${players.length} players`);
    }
    
    // Test reading picks
    const { data: picks, error: pickError } = await supabase
      .from('pick')
      .select('*');
      
    if (pickError) {
      console.error('Error reading picks:', pickError);
    } else {
      console.log(`Successfully read ${picks.length} picks`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testRead(); 