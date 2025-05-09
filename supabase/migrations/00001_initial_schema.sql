-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create player table
CREATE TABLE IF NOT EXISTS player (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create automated updated_at trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_timestamp
BEFORE UPDATE ON player
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- Create pick table 
CREATE TABLE IF NOT EXISTS pick (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES player(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  selection TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(player_id, week, selection)
);

CREATE TRIGGER update_pick_timestamp
BEFORE UPDATE ON pick
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- Create RLS policies
ALTER TABLE player ENABLE ROW LEVEL SECURITY;
ALTER TABLE pick ENABLE ROW LEVEL SECURITY;

-- Everyone can read players
CREATE POLICY read_player ON player 
  FOR SELECT USING (true);

-- Everyone can read picks
CREATE POLICY read_pick ON pick
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete players and picks
CREATE POLICY write_player ON player
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY write_pick ON pick
  FOR ALL USING (auth.role() = 'authenticated');

-- Create helper functions

-- Function to get picks for next week
CREATE OR REPLACE FUNCTION get_picks_for_next_week(player_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_week INTEGER;
  correct_count INTEGER;
BEGIN
  -- Get the current week (max week in the picks table)
  SELECT COALESCE(MAX(week), 0) INTO current_week FROM pick;
  
  -- Count correct picks for the player in the current week
  SELECT COUNT(*) INTO correct_count 
  FROM pick 
  WHERE player_id = player_uuid 
    AND week = current_week 
    AND is_correct = true;
  
  -- Return picks allowed for next week (2 if both correct, otherwise 1)
  RETURN CASE WHEN correct_count >= 2 THEN 2 ELSE 1 END;
END;
$$ LANGUAGE plpgsql; 