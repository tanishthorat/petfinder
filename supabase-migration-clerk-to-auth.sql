-- Migration: Replace Clerk auth with Supabase Auth
-- This updates the users table to use Supabase's built-in auth.uid()

-- Step 1: Remove clerk_user_id column and related indexes/policies
ALTER TABLE users DROP COLUMN IF EXISTS clerk_user_id CASCADE;
DROP INDEX IF EXISTS idx_users_clerk_id;

-- Step 2: Update the users table to use UUID primary key matching auth.users
-- Note: This assumes your users.id is already UUID type
-- If existing data exists, you'll need to handle migration carefully

-- Step 3: Update RLS policies to use auth.uid() directly (Simplified & Corrected)

-- Users policies
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
CREATE POLICY "Users can create their own profile" ON users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Pets policies
DROP POLICY IF EXISTS "Users can view available pets" ON pets;
CREATE POLICY "Users can view available pets" ON pets
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can create their own pets" ON pets;
CREATE POLICY "Users can create their own pets" ON pets
    FOR INSERT
    WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own pets" ON pets;
CREATE POLICY "Users can update their own pets" ON pets
    FOR UPDATE
    USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own pets" ON pets;
CREATE POLICY "Users can delete their own pets" ON pets
    FOR DELETE
    USING (owner_id = auth.uid());

-- Swipes policies
DROP POLICY IF EXISTS "Users can view their own swipes" ON swipes;
CREATE POLICY "Users can view their own swipes" ON swipes
    FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create swipes" ON swipes;
CREATE POLICY "Users can create swipes" ON swipes
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Matches policies
DROP POLICY IF EXISTS "Users can view their matches" ON matches;
CREATE POLICY "Users can view their matches" ON matches
    FOR SELECT
    USING (adopter_id = auth.uid() OR owner_id = auth.uid());

-- Messages policies
DROP POLICY IF EXISTS "Users can view messages in their matches" ON messages;
CREATE POLICY "Users can view messages in their matches" ON messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = messages.match_id
            AND (matches.adopter_id = auth.uid() OR matches.owner_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can send messages in their matches" ON messages;
CREATE POLICY "Users can send messages in their matches" ON messages
    FOR INSERT
    WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = messages.match_id
            AND (matches.adopter_id = auth.uid() OR matches.owner_id = auth.uid())
        )
    );

-- User preferences policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their own preferences" ON user_preferences;
CREATE POLICY "Users can manage their own preferences" ON user_preferences
    FOR ALL
    USING (user_id = auth.uid());
