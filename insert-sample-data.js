const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSampleData() {
  try {
    console.log('Inserting sample data...');
    
    // Insert players
    const { data: players, error: playerError } = await supabase
      .from('player')
      .insert([
        { name: 'Dean' },
        { name: 'Joe' },
        { name: 'Gaz' },
        { name: 'Sean' }
      ])
      .select();
      
    if (playerError) {
      console.error('Error inserting players:', playerError);
      return;
    }
    
    console.log('Players inserted successfully:', players);
    
    // Get player IDs
    const playerMap = {};
    for (const player of players) {
      playerMap[player.name.toLowerCase()] = player.id;
    }
    
    console.log('Player IDs:', playerMap);
    
    // Insert picks for week 1
    const week1Picks = [
      { player_id: playerMap.dean, week: 1, selection: 'Chiefs', is_correct: true },
      { player_id: playerMap.dean, week: 1, selection: 'Eagles', is_correct: false },
      { player_id: playerMap.joe, week: 1, selection: 'Bills', is_correct: true },
      { player_id: playerMap.gaz, week: 1, selection: 'Cowboys', is_correct: false },
      { player_id: playerMap.sean, week: 1, selection: 'Packers', is_correct: true }
    ];
    
    const { data: week1PicksData, error: week1Error } = await supabase
      .from('pick')
      .insert(week1Picks)
      .select();
      
    if (week1Error) {
      console.error('Error inserting week 1 picks:', week1Error);
      return;
    }
    
    console.log('Week 1 picks inserted successfully!');
    
    // Insert picks for week 2
    const week2Picks = [
      { player_id: playerMap.dean, week: 2, selection: 'Ravens', is_correct: true },
      { player_id: playerMap.joe, week: 2, selection: '49ers', is_correct: true },
      { player_id: playerMap.gaz, week: 2, selection: 'Jets', is_correct: false },
      { player_id: playerMap.sean, week: 2, selection: 'Dolphins', is_correct: false }
    ];
    
    const { data: week2PicksData, error: week2Error } = await supabase
      .from('pick')
      .insert(week2Picks)
      .select();
      
    if (week2Error) {
      console.error('Error inserting week 2 picks:', week2Error);
      return;
    }
    
    console.log('Week 2 picks inserted successfully!');
    
    // Insert picks for week 3
    const week3Picks = [
      { player_id: playerMap.dean, week: 3, selection: 'Bengals', is_correct: true },
      { player_id: playerMap.joe, week: 3, selection: 'Steelers', is_correct: false },
      { player_id: playerMap.gaz, week: 3, selection: 'Rams', is_correct: true },
      { player_id: playerMap.gaz, week: 3, selection: 'Browns', is_correct: false },
      { player_id: playerMap.sean, week: 3, selection: 'Lions', is_correct: true }
    ];
    
    const { data: week3PicksData, error: week3Error } = await supabase
      .from('pick')
      .insert(week3Picks)
      .select();
      
    if (week3Error) {
      console.error('Error inserting week 3 picks:', week3Error);
      return;
    }
    
    console.log('Week 3 picks inserted successfully!');
    
    // Check data
    const { data: allPlayers } = await supabase.from('player').select('*');
    const { data: allPicks } = await supabase.from('pick').select('*');
    
    console.log(`Total players: ${allPlayers.length}`);
    console.log(`Total picks: ${allPicks.length}`);
    
    console.log('Sample data inserted successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

insertSampleData(); 