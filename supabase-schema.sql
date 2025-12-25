-- Pet Finder Supabase Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('adopter', 'owner', 'shelter', 'admin');
CREATE TYPE pet_species AS ENUM ('dog', 'cat', 'bird', 'rabbit', 'other');
CREATE TYPE pet_gender AS ENUM ('male', 'female');
CREATE TYPE pet_size AS ENUM ('small', 'medium', 'large', 'extra_large');
CREATE TYPE energy_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE pet_status AS ENUM ('available', 'pending', 'adopted', 'removed');
CREATE TYPE swipe_direction AS ENUM ('left', 'right');
CREATE TYPE match_status AS ENUM ('matched', 'contacted', 'meeting_scheduled', 'adopted', 'rejected');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    profile_image_url TEXT,
    phone VARCHAR(50),
    address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    bio TEXT,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pets Table
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    species pet_species NOT NULL,
    breed VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL, -- in months
    gender pet_gender NOT NULL,
    size pet_size NOT NULL,
    color VARCHAR(100),
    description TEXT,
    health_status TEXT,
    vaccination_status BOOLEAN,
    is_neutered BOOLEAN,
    good_with_kids BOOLEAN,
    good_with_pets BOOLEAN,
    energy_level energy_level,
    temperament TEXT[],
    special_needs TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_address TEXT,
    status pet_status DEFAULT 'available',
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swipes Table
CREATE TABLE swipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    direction swipe_direction NOT NULL,
    swiped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, pet_id)
);

-- Matches Table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adopter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status match_status DEFAULT 'matched',
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    species TEXT[],
    age_min INTEGER,
    age_max INTEGER,
    size TEXT[],
    gender TEXT[],
    distance_km INTEGER,
    good_with_kids BOOLEAN,
    good_with_pets BOOLEAN,
    energy_level TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_swipes_user_direction ON swipes(user_id, direction);
CREATE INDEX idx_matches_adopter_status ON matches(adopter_id, status);
CREATE INDEX idx_matches_owner_status ON matches(owner_id, status);
CREATE INDEX idx_messages_match_created ON messages(match_id, created_at);

-- Create Updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Anyone can create a user profile"
    ON users FOR INSERT
    WITH CHECK (true);

-- RLS Policies for Pets
CREATE POLICY "Anyone can view available pets"
    ON pets FOR SELECT
    USING (status = 'available' OR owner_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

CREATE POLICY "Owners can create pets"
    ON pets FOR INSERT
    WITH CHECK (owner_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

CREATE POLICY "Owners can update their own pets"
    ON pets FOR UPDATE
    USING (owner_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

CREATE POLICY "Owners can delete their own pets"
    ON pets FOR DELETE
    USING (owner_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

-- RLS Policies for Swipes
CREATE POLICY "Users can view their own swipes"
    ON swipes FOR SELECT
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

CREATE POLICY "Users can create swipes"
    ON swipes FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

-- RLS Policies for Matches
CREATE POLICY "Users can view their matches"
    ON matches FOR SELECT
    USING (
        adopter_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
        OR owner_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "System can create matches"
    ON matches FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Match participants can update status"
    ON matches FOR UPDATE
    USING (
        adopter_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
        OR owner_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- RLS Policies for Messages
CREATE POLICY "Match participants can view messages"
    ON messages FOR SELECT
    USING (
        match_id IN (
            SELECT id FROM matches 
            WHERE adopter_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
            OR owner_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
        )
    );

CREATE POLICY "Match participants can send messages"
    ON messages FOR INSERT
    WITH CHECK (
        sender_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
        AND match_id IN (
            SELECT id FROM matches 
            WHERE adopter_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
            OR owner_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
        )
    );

-- RLS Policies for User Preferences
CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

CREATE POLICY "Users can create their preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

CREATE POLICY "Users can update their preferences"
    ON user_preferences FOR UPDATE
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ));

-- Create Storage Bucket for Pet Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy for Pet Images
CREATE POLICY "Anyone can view pet images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'pet-images');

CREATE POLICY "Authenticated users can upload pet images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'pet-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their pet images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'pet-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their pet images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'pet-images' AND auth.role() = 'authenticated');

-- Create Realtime publication for messages (for real-time chat)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
