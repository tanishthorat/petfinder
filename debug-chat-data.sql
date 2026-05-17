-- Debug Chat Data
-- Run this to check if your matches have proper data

-- 1. Check matches table
SELECT 
  id as match_id,
  adopter_id,
  owner_id,
  pet_id,
  status,
  matched_at
FROM matches
ORDER BY matched_at DESC
LIMIT 5;

-- 2. Check if adopters exist in users table
SELECT 
  m.id as match_id,
  m.adopter_id,
  u.id as user_exists,
  u.full_name,
  u.email
FROM matches m
LEFT JOIN users u ON u.id = m.adopter_id
ORDER BY m.matched_at DESC
LIMIT 5;

-- 3. Check if owners exist in users table
SELECT 
  m.id as match_id,
  m.owner_id,
  u.id as user_exists,
  u.full_name,
  u.email
FROM matches m
LEFT JOIN users u ON u.id = m.owner_id
ORDER BY m.matched_at DESC
LIMIT 5;

-- 4. Check if pets exist
SELECT 
  m.id as match_id,
  m.pet_id,
  p.id as pet_exists,
  p.name as pet_name,
  p.species
FROM matches m
LEFT JOIN pets p ON p.id = m.pet_id
ORDER BY m.matched_at DESC
LIMIT 5;

-- 5. Complete match data check
SELECT 
  m.id as match_id,
  m.adopter_id,
  adopter.full_name as adopter_name,
  m.owner_id,
  owner.full_name as owner_name,
  m.pet_id,
  p.name as pet_name,
  CASE 
    WHEN adopter.id IS NULL THEN '❌ Missing adopter'
    WHEN owner.id IS NULL THEN '❌ Missing owner'
    WHEN p.id IS NULL THEN '❌ Missing pet'
    ELSE '✅ All data present'
  END as status
FROM matches m
LEFT JOIN users adopter ON adopter.id = m.adopter_id
LEFT JOIN users owner ON owner.id = m.owner_id
LEFT JOIN pets p ON p.id = m.pet_id
ORDER BY m.matched_at DESC
LIMIT 10;

-- 6. Check messages count per match
SELECT 
  match_id,
  COUNT(*) as message_count,
  MAX(created_at) as last_message
FROM messages
GROUP BY match_id
ORDER BY last_message DESC;

