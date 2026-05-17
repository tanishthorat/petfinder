-- Fix Pet Enum Values
-- Run this in your Supabase SQL Editor to fix existing pet data

-- Update species to lowercase
UPDATE pets 
SET species = LOWER(species::text)::pet_species
WHERE species IS NOT NULL;

-- Update gender to lowercase  
UPDATE pets
SET gender = LOWER(gender::text)::pet_gender
WHERE gender IS NOT NULL;

-- Update size to lowercase and handle 'Extra Large' -> 'extra_large'
UPDATE pets
SET size = CASE
  WHEN LOWER(size::text) = 'extra large' THEN 'extra_large'
  ELSE LOWER(size::text)
END::pet_size
WHERE size IS NOT NULL;

-- Update status to available if it's null or invalid
UPDATE pets
SET status = 'available'
WHERE status IS NULL OR status NOT IN ('available', 'pending', 'adopted', 'removed');

-- Verify the changes
SELECT 
  COUNT(*) as total_pets,
  COUNT(DISTINCT species) as unique_species,
  COUNT(DISTINCT gender) as unique_genders,
  COUNT(DISTINCT size) as unique_sizes,
  COUNT(DISTINCT status) as unique_statuses
FROM pets;

-- Show sample of updated data
SELECT id, name, species, gender, size, status, owner_id
FROM pets
LIMIT 10;

