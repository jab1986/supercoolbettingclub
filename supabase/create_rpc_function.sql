-- Create the get_picks_for_next_week function
CREATE OR REPLACE FUNCTION get_picks_for_next_week(player_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_week INTEGER;
  correct_picks INTEGER;
BEGIN
  -- Get the current week (max week number in the system)
  SELECT COALESCE(MAX(week), 1) INTO current_week FROM pick;
  
  -- Calculate number of correct picks in the current week
  SELECT COUNT(*) INTO correct_picks
  FROM pick
  WHERE player_id = player_uuid
    AND week = current_week
    AND is_correct = true;
  
  -- Assign picks for next week based on current week performance
  -- Default is 1 pick
  -- 2 picks if they got at least one correct this week
  IF correct_picks > 0 THEN
    RETURN 2;
  ELSE
    RETURN 1;
  END IF;
END;
$$;

-- Test the function
SELECT get_picks_for_next_week((SELECT id FROM player LIMIT 1)) as picks_next_week; 