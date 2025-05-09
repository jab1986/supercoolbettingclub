-- Insert sample players
INSERT INTO player (name) VALUES
  ('Dean'),
  ('Joe'),
  ('Gaz'),
  ('Sean');

-- Store player IDs for reference (these will be assigned dynamically)
DO $$
DECLARE
  dean_id UUID;
  joe_id UUID;
  gaz_id UUID;
  sean_id UUID;
  current_week INTEGER := 1;
BEGIN
  -- Get player IDs
  SELECT id INTO dean_id FROM player WHERE name = 'Dean';
  SELECT id INTO joe_id FROM player WHERE name = 'Joe';
  SELECT id INTO gaz_id FROM player WHERE name = 'Gaz';
  SELECT id INTO sean_id FROM player WHERE name = 'Sean';
  
  -- Insert picks for week 1
  INSERT INTO pick (player_id, week, selection, is_correct) VALUES
    (dean_id, current_week, 'Chiefs', true),
    (dean_id, current_week, 'Eagles', false),
    (joe_id, current_week, 'Bills', true),
    (gaz_id, current_week, 'Cowboys', false),
    (sean_id, current_week, 'Chiefs', true),
    (sean_id, current_week, 'Bills', true);
    
  -- Insert picks for week 2
  current_week := 2;
  INSERT INTO pick (player_id, week, selection, is_correct) VALUES
    (dean_id, current_week, 'Ravens', true),
    (joe_id, current_week, 'Lions', true),
    (joe_id, current_week, 'Dolphins', false),
    (gaz_id, current_week, 'Ravens', true),
    (gaz_id, current_week, 'Lions', true),
    (sean_id, current_week, 'Vikings', false);
END $$; 