-- This SQL script should be run in the Supabase dashboard SQL editor
-- It bypasses RLS policies and inserts data directly

-- Clear existing data (optional)
DELETE FROM pick;
DELETE FROM player;

-- Insert players
INSERT INTO player (name) VALUES 
('Dean'),
('Joe'),
('Gaz'),
('Sean')
RETURNING id, name;

-- Store the player IDs as variables
DO $$
DECLARE
    dean_id UUID;
    joe_id UUID;
    gaz_id UUID;
    sean_id UUID;
BEGIN
    -- Get the player IDs
    SELECT id INTO dean_id FROM player WHERE name = 'Dean';
    SELECT id INTO joe_id FROM player WHERE name = 'Joe';
    SELECT id INTO gaz_id FROM player WHERE name = 'Gaz';
    SELECT id INTO sean_id FROM player WHERE name = 'Sean';
    
    -- Insert picks for week 1
    INSERT INTO pick (player_id, week, selection, is_correct) VALUES
    (dean_id, 1, 'Chiefs', true),
    (dean_id, 1, 'Eagles', false),
    (joe_id, 1, 'Bills', true),
    (gaz_id, 1, 'Cowboys', false),
    (sean_id, 1, 'Packers', true);
    
    -- Insert picks for week 2
    INSERT INTO pick (player_id, week, selection, is_correct) VALUES
    (dean_id, 2, 'Ravens', true),
    (joe_id, 2, '49ers', true),
    (gaz_id, 2, 'Jets', false),
    (sean_id, 2, 'Dolphins', false);
    
    -- Insert picks for week 3
    INSERT INTO pick (player_id, week, selection, is_correct) VALUES
    (dean_id, 3, 'Bengals', true),
    (joe_id, 3, 'Steelers', false),
    (gaz_id, 3, 'Rams', true),
    (gaz_id, 3, 'Browns', false),
    (sean_id, 3, 'Lions', true);
    
    -- Verify the data was inserted
    RAISE NOTICE 'Inserted data for players: %, %, %, %', dean_id, joe_id, gaz_id, sean_id;
END $$;

-- Display the results
SELECT 'Players' AS table_name, COUNT(*) AS record_count FROM player
UNION ALL
SELECT 'Picks' AS table_name, COUNT(*) AS record_count FROM pick;

-- Verify RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    tablename IN ('player', 'pick')
ORDER BY
    tablename, policyname; 