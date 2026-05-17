// scripts/seed-pets.ts
import { createClient } from '@supabase/supabase-js';
import { Pet } from '@/types'; // Adjust this import if your types are located elsewhere

// IMPORTANT: Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or service role key is missing from .env.local');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Mock data adapted for seeding
const mockPets: Omit<Pet, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    owner_id: '', // Will be replaced with an actual user ID
    name: "Bella",
    species: "dog",
    breed: "Golden Retriever",
    age: 24, // in months
    gender: "female",
    size: "large",
    description: "Friendly and energetic, loves playing fetch! Looking for a home in Nagpur.",
    health_status: "Healthy and vaccinated.",
    vaccination_status: true,
    is_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    images: ["https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop"],
    status: 'available',
    location_lat: 21.1458,
    location_lng: 79.0882,
    location_address: 'Sitabuldi, Nagpur, Maharashtra, India',
  },
  {
    owner_id: '',
    name: "Luna",
    species: "cat",
    breed: "Siamese",
    age: 18,
    gender: "female",
    size: "medium",
    description: "Luna is a talkative and affectionate Siamese cat looking for a loving home in the heart of Nagpur.",
    health_status: "Up to date on all shots.",
    vaccination_status: true,
    is_neutered: true,
    good_with_kids: true,
    good_with_pets: false,
    images: ["https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=600&auto=format&fit=crop"],
    status: 'available',
    location_lat: 21.1700,
    location_lng: 79.0898,
    location_address: 'Dharampeth, Nagpur, Maharashtra, India',
  },
  {
    owner_id: '',
    name: "Thumper",
    species: "rabbit",
    breed: "Holland Lop",
    age: 6,
    gender: "male",
    size: "small",
    description: "A cute little bunny who loves carrots and hopping around. Needs a quiet home in Nagpur.",
    health_status: "Healthy",
    vaccination_status: false,
    is_neutered: false,
    good_with_kids: true,
    good_with_pets: true,
    images: ["https://images.unsplash.com/photo-1585110396063-8355845b3728?q=80&w=600&auto=format&fit=crop"],
    status: 'available',
    location_lat: 21.1594,
    location_lng: 79.0783,
    location_address: 'Ramdaspeth, Nagpur, Maharashtra, India',
  },
  {
    owner_id: '',
    name: "Max",
    species: "dog",
    breed: "German Shepherd",
    age: 48,
    gender: "male",
    size: "large",
    description: "Max is a loyal companion who loves long walks in Nagpur's parks. He is very protective.",
    health_status: "Excellent health",
    vaccination_status: true,
    is_neutered: true,
    good_with_kids: false,
    good_with_pets: true,
    images: ["https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=600&auto=format&fit=crop"],
    status: 'available',
    location_lat: 21.1462,
    location_lng: 79.0624,
    location_address: 'Bajaj Nagar, Nagpur, Maharashtra, India',
  },
  {
    owner_id: '',
    name: "Rio",
    species: "bird",
    breed: "Macaw",
    age: 60,
    gender: "male",
    size: "medium",
    description: "Rio is a vibrant Macaw who loves to be the center of attention and enjoys the Nagpur weather.",
    health_status: "Healthy",
    vaccination_status: true,
    is_neutered: false,
    good_with_kids: false,
    good_with_pets: false,
    images: ["https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=600&auto=format&fit=crop"],
    status: 'available',
    location_lat: 21.1537,
    location_lng: 79.0799,
    location_address: 'Civil Lines, Nagpur, Maharashtra, India',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Get an existing user to be the owner of the pets
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (userError || !users || users.length === 0) {
    console.error('❌ Error fetching user or no users found. Please sign up a user first.');
    console.error(userError);
    return;
  }

  const ownerId = users[0].id;
  console.log(`🐾 Found owner user with ID: ${ownerId}`);

  // 2. Add the owner_id to all mock pets
  const petsWithOwners = mockPets.map(pet => ({ ...pet, owner_id: ownerId }));

  // 3. Clear existing pets to avoid duplicates
  const { error: deleteError } = await supabase.from('pets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('❌ Error clearing pets table:', deleteError.message);
    return;
  }
  console.log('🗑️ Cleared existing pets from the database.');

  // 4. Insert the new pets
  const { data, error: insertError } = await supabase
    .from('pets')
    .insert(petsWithOwners)
    .select();

  if (insertError) {
    console.error('❌ Error inserting pets:', insertError.message);
    return;
  }

  console.log(`✅ Successfully seeded ${data.length} pets.`);
  console.log('🎉 Database seeding complete.');
}

main().catch(console.error);
