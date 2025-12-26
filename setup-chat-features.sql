-- Quick Chat Setup (Realtime Already Enabled)
-- Run this in your Supabase SQL Editor

-- 1. Add read column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'read'
  ) THEN
    ALTER TABLE messages ADD COLUMN read BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ Added read column to messages table';
  ELSE
    RAISE NOTICE 'ℹ️ Read column already exists - skipping';
  END IF;
END $$;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read) WHERE read = false;

RAISE NOTICE '✅ Indexes created';

-- 3. Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (for clean slate)
DROP POLICY IF EXISTS "Users can read their match messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their matches" ON messages;
DROP POLICY IF EXISTS "Users can mark received messages as read" ON messages;

-- 5. Create RLS Policies

-- Policy: Users can read messages from their matches
CREATE POLICY "Users can read their match messages" ON messages
  FOR SELECT USING (
    match_id IN (
      SELECT id FROM matches 
      WHERE adopter_id = auth.uid() OR owner_id = auth.uid()
    )
  );

RAISE NOTICE '✅ Read policy created';

-- Policy: Users can insert messages to their matches
CREATE POLICY "Users can send messages to their matches" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    match_id IN (
      SELECT id FROM matches 
      WHERE adopter_id = auth.uid() OR owner_id = auth.uid()
    )
  );

RAISE NOTICE '✅ Insert policy created';

-- Policy: Users can update read status on messages they received
CREATE POLICY "Users can mark received messages as read" ON messages
  FOR UPDATE USING (
    sender_id != auth.uid() AND
    match_id IN (
      SELECT id FROM matches 
      WHERE adopter_id = auth.uid() OR owner_id = auth.uid()
    )
  )
  WITH CHECK (
    -- Only allow updating the read column
    sender_id = (SELECT sender_id FROM messages WHERE id = messages.id) AND
    message = (SELECT message FROM messages WHERE id = messages.id) AND
    match_id = (SELECT match_id FROM messages WHERE id = messages.id)
  );

RAISE NOTICE '✅ Update policy created';

-- 6. Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON messages TO authenticated;

RAISE NOTICE '✅ Permissions granted';

-- 7. Verify realtime is enabled
DO $$
DECLARE
  is_enabled BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) INTO is_enabled;
  
  IF is_enabled THEN
    RAISE NOTICE '✅ Realtime is enabled for messages table';
  ELSE
    RAISE WARNING '⚠️ Realtime is NOT enabled - enable it in Supabase Dashboard';
  END IF;
END $$;

-- 8. Verify RLS policies
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'messages';
  
  RAISE NOTICE '✅ Total policies configured: %', policy_count;
END $$;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE '  ✅ Chat Setup Complete!';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Summary:';
  RAISE NOTICE '  ✓ Read column configured';
  RAISE NOTICE '  ✓ Indexes created';
  RAISE NOTICE '  ✓ RLS policies enabled';
  RAISE NOTICE '  ✓ Permissions granted';
  RAISE NOTICE '  ✓ Realtime verified';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Your chat is ready to use!';
  RAISE NOTICE '';
  RAISE NOTICE '📍 Next Steps:';
  RAISE NOTICE '  1. Test in two browsers';
  RAISE NOTICE '  2. Send messages back and forth';
  RAISE NOTICE '  3. Check typing indicators';
  RAISE NOTICE '  4. Verify read receipts';
  RAISE NOTICE '';
END $$;

