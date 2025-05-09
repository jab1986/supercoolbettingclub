# SCBC Setup Guide

## Supabase Configuration

### 1. Database Schema
Your database schema appears to be correctly set up with two tables:
- `player` - contains league participants
- `pick` - contains weekly picks made by players

### 2. Row Level Security (RLS)
To make the application work correctly, you need to configure RLS policies:

1. Go to your Supabase Dashboard → Authentication → Policies
2. For both `player` and `pick` tables:
   - Enable RLS if not already enabled
   - Add a policy for SELECT that allows public access:
     - Policy name: `Allow public read access`
     - Target roles: Leave blank (for all roles)
     - Using expression: `true`
   - Add policies for INSERT, UPDATE, DELETE that allow only authenticated users:
     - Policy name: `Allow admin operations`
     - Target roles: `authenticated`
     - Using expression: `auth.role() = 'authenticated'`

### 3. Sample Data
Run the following SQL in your Supabase SQL Editor to populate sample data:

```sql
-- Run this in Supabase SQL Editor
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
END $$;

-- Verify the data
SELECT 'Players' AS table_name, COUNT(*) AS record_count FROM player
UNION ALL
SELECT 'Picks' AS table_name, COUNT(*) AS record_count FROM pick;
```

## Testing the Application

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Testing API Endpoints
Use curl or your browser to test:

```bash
# Get league standings
curl http://localhost:3000/api/league

# Expected output with data:
# {"standings":[{"id":"...","name":"Dean","points":4,...}, ...], "success":true}
```

### 3. Accessing the Web Application
- Public league table: http://localhost:3000/
- Admin interface: http://localhost:3000/admin

## Troubleshooting

### Empty League Table
If your league table is empty:
1. Verify data exists in Supabase (run: `SELECT * FROM player; SELECT * FROM pick;`)
2. Check RLS policies allow public SELECT access
3. Confirm your environment variables are correct in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### API Errors
If you see API errors:
1. Check browser console for specific error messages
2. Look at the server logs in your terminal
3. Test API endpoints directly with curl
4. Verify your Supabase credentials are correct

### Authorization Issues
For admin pages:
1. Create a user in Supabase Authentication
2. Enable email/password sign-in method
3. Use the admin login page to authenticate 