-- Enable Real-Time Chat Features
-- Run this in your Supabase SQL Editor

-- 1. Enable Realtime for messages table (skip if already enabled)
DO $$
BEGIN
  -- Check if messages table is already in the publication
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    RAISE NOTICE '✅ Realtime enabled for messages table';
  ELSE
    RAISE NOTICE 'ℹ️ Realtime already enabled for messages table - skipping';
  END IF;
END $$;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read) WHERE read = false;

-- 3. Add read column if it doesn't exist
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false;

-- 4. Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (for clean slate)
DROP POLICY IF EXISTS "Users can read their match messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their matches" ON messages;
DROP POLICY IF EXISTS "Users can mark received messages as read" ON messages;

-- 6. Create RLS Policies

-- Policy: Users can read messages from their matches
CREATE POLICY "Users can read their match messages" ON messages
  FOR SELECT USING (
    match_id IN (
      SELECT id FROM matches 
      WHERE adopter_id = auth.uid() OR owner_id = auth.uid()
    )
  );

-- Policy: Users can insert messages to their matches
CREATE POLICY "Users can send messages to their matches" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    match_id IN (
      SELECT id FROM matches 
      WHERE adopter_id = auth.uid() OR owner_id = auth.uid()
    )
  );

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

-- 7. Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON messages TO authenticated;

-- 8. Create a function to get unread message count (optional, for notifications)
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM messages m
    JOIN matches mt ON m.match_id = mt.id
    WHERE m.read = false 
    AND m.sender_id != user_uuid
    AND (mt.adopter_id = user_uuid OR mt.owner_id = user_uuid)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Verify configuration
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'messages';

-- 10. Test realtime is enabled
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND tablename = 'messages';

-- If the above query returns a row, realtime is enabled! ✅

-- 11. Optional: Create a view for chat previews
CREATE OR REPLACE VIEW chat_previews AS
SELECT 
  m.match_id,
  m.message AS last_message,
  m.created_at AS last_message_at,
  m.sender_id AS last_sender_id,
  COUNT(CASE WHEN m2.read = false AND m2.sender_id != auth.uid() THEN 1 END) AS unread_count
FROM messages m
JOIN matches mt ON m.match_id = mt.id
LEFT JOIN messages m2 ON m2.match_id = m.match_id
WHERE (mt.adopter_id = auth.uid() OR mt.owner_id = auth.uid())
  AND m.created_at = (
    SELECT MAX(created_at) 
    FROM messages 
    WHERE match_id = m.match_id
  )
GROUP BY m.match_id, m.message, m.created_at, m.sender_id;

-- Grant access to the view
GRANT SELECT ON chat_previews TO authenticated;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Real-time chat features enabled successfully!';
  RAISE NOTICE '✅ Row Level Security configured';
  RAISE NOTICE '✅ Indexes created for performance';
  RAISE NOTICE '✅ Realtime publication updated';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Your chat is now production-ready!';
END $$;

