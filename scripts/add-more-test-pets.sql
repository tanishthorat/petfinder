-- Add More Test Pets to Database
-- Run this in Supabase SQL Editor to add more pets for testing

-- First, let's create a shelter owner if needed
INSERT INTO users (id, email, full_name, role)
VALUES 
  ('test-shelter-1', 'shelter1@example.com', 'Happy Paws Shelter', 'shelter'),
  ('test-shelter-2', 'shelter2@example.com', 'Pet Paradise', 'shelter')
ON CONFLICT (id) DO NOTHING;

-- Add more diverse pets
INSERT INTO pets (
  id, name, species, breed, age, gender, size, 
  description, status, images, location, owner_id
) VALUES 
  (
    gen_random_uuid(),
    'Charlie',
    'dog',
    'Labrador Retriever',
    36,
    'male',
    'large',
    'Energetic and loves to play fetch! Great with kids.',
    'available',
    ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600'],
    'Los Angeles, CA',
    'test-shelter-1'
  ),
  (
    gen_random_uuid(),
    'Mittens',
    'cat',
    'Persian',
    24,
    'female',
    'medium',
    'Sweet and gentle cat who loves to cuddle.',
    'available',
    ARRAY['https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=600'],
    'San Francisco, CA',
    'test-shelter-1'
  ),
  (
    gen_random_uuid(),
    'Buddy',
    'dog',
    'Beagle',
    18,
    'male',
    'medium',
    'Friendly beagle with a great nose for adventure!',
    'available',
    ARRAY['https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600'],
    'Austin, TX',
    'test-shelter-2'
  ),
  (
    gen_random_uuid(),
    'Whiskers',
    'cat',
    'Tabby',
    12,
    'male',
    'small',
    'Playful kitten looking for a loving home.',
    'available',
    ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600'],
    'Seattle, WA',
    'test-shelter-2'
  ),
  (
    gen_random_uuid(),
    'Rocky',
    'dog',
    'German Shepherd',
    48,
    'male',
    'large',
    'Loyal and protective, great guard dog.',
    'available',
    ARRAY['https://images.unsplash.com/photo-1568572933382-74d440642117?w=600'],
    'Miami, FL',
    'test-shelter-1'
  ),
  (
    gen_random_uuid(),
    'Snowball',
    'cat',
    'Siamese',
    30,
    'female',
    'medium',
    'Beautiful blue-eyed cat with a sweet personality.',
    'available',
    ARRAY['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600'],
    'Boston, MA',
    'test-shelter-2'
  ),
  (
    gen_random_uuid(),
    'Daisy',
    'dog',
    'Poodle',
    24,
    'female',
    'small',
    'Adorable poodle who loves attention and treats!',
    'available',
    ARRAY['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600'],
    'Portland, OR',
    'test-shelter-1'
  ),
  (
    gen_random_uuid(),
    'Shadow',
    'cat',
    'Black Cat',
    15,
    'male',
    'medium',
    'Mysterious and affectionate black cat.',
    'available',
    ARRAY['https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600'],
    'Denver, CO',
    'test-shelter-2'
  ),
  (
    gen_random_uuid(),
    'Coco',
    'bird',
    'Cockatiel',
    6,
    'female',
    'small',
    'Chirpy bird who loves to sing and dance!',
    'available',
    ARRAY['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600'],
    'Phoenix, AZ',
    'test-shelter-1'
  ),
  (
    gen_random_uuid(),
    'Hopper',
    'rabbit',
    'Holland Lop',
    8,
    'male',
    'small',
    'Fluffy bunny who loves carrots and cuddles.',
    'available',
    ARRAY['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600'],
    'Nashville, TN',
    'test-shelter-2'
  );

-- Verify the insert
SELECT name, species, gender, size, status, owner_id
FROM pets
ORDER BY created_at DESC
LIMIT 15;

