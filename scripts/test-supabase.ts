import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log('Parsed env variables:', Object.keys(envConfig));
console.log('NEXT_PUBLIC_SUPABASE_URL from file:', envConfig.NEXT_PUBLIC_SUPABASE_URL);

// Manually set the environment variables
Object.keys(envConfig).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = envConfig[key];
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n✓ Environment loaded from:', envPath);
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `✓ ${supabaseUrl.substring(0, 30)}...` : '✗ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Found' : '✗ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('⚠️  Database tables not found. You need to run the schema SQL.');
        console.log('\n📋 To set up your database:');
        console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Copy the contents of supabase-schema.sql');
        console.log('5. Paste and run it in the SQL Editor\n');
        return false;
      }
      throw error;
    }

    console.log('✅ Successfully connected to Supabase database!');
    console.log('✅ Database schema is set up correctly!\n');
    return true;
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function seedData() {
  console.log('🌱 Seeding sample data...\n');

  try {
    // Create sample adopter user
    const { data: adopter, error: adopterError } = await supabase
      .from('users')
      .insert([
        {
          clerk_user_id: 'user_adopter_sample',
          email: 'adopter@example.com',
          full_name: 'Alice Adopter',
          role: 'adopter',
          bio: 'Looking for a furry companion',
          location_lat: 40.7128,
          location_lng: -74.006,
        },
      ])
      .select()
      .single();

    if (adopterError && !adopterError.message.includes('duplicate key')) {
      throw adopterError;
    }

    // Create sample owner user
    const { data: owner, error: ownerError } = await supabase
      .from('users')
      .insert([
        {
          clerk_user_id: 'user_owner_sample',
          email: 'owner@example.com',
          full_name: 'Bob Owner',
          role: 'owner',
          bio: 'Helping pets find loving homes',
          location_lat: 40.7306,
          location_lng: -73.9352,
        },
      ])
      .select()
      .single();

    if (ownerError && !ownerError.message.includes('duplicate key')) {
      throw ownerError;
    }

    console.log('✅ Sample users created');

    // Get users for foreign keys
    const { data: users } = await supabase
      .from('users')
      .select('id, clerk_user_id');

    const ownerId = users?.find(u => u.clerk_user_id === 'user_owner_sample')?.id;

    if (ownerId) {
      // Create sample pets
      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .insert([
          {
            owner_id: ownerId,
            name: 'Bella',
            species: 'dog',
            breed: 'Golden Retriever',
            age: 24,
            gender: 'female',
            size: 'large',
            color: 'Golden',
            description: 'Friendly and energetic, loves playing fetch!',
            health_status: 'Healthy',
            vaccination_status: true,
            is_neutered: true,
            good_with_kids: true,
            good_with_pets: true,
            energy_level: 'high',
            temperament: ['friendly', 'playful', 'energetic'],
            images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600'],
            location_lat: 40.7306,
            location_lng: -73.9352,
            location_address: '123 Bark St, Brooklyn, NY',
          },
          {
            owner_id: ownerId,
            name: 'Charlie',
            species: 'dog',
            breed: 'Beagle',
            age: 12,
            gender: 'male',
            size: 'medium',
            color: 'Tricolor',
            description: 'Curious puppy looking for a loving home',
            health_status: 'Up to date on all shots',
            vaccination_status: true,
            is_neutered: false,
            good_with_kids: true,
            good_with_pets: true,
            energy_level: 'medium',
            temperament: ['curious', 'playful'],
            images: ['https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=600'],
            location_lat: 40.7306,
            location_lng: -73.9352,
            location_address: '456 Fetch Ave, Brooklyn, NY',
          },
        ])
        .select();

      if (petsError && !petsError.message.includes('duplicate key')) {
        throw petsError;
      }

      console.log('✅ Sample pets created');
    }

    console.log('\n🎉 Database seeded successfully!\n');
  } catch (error: any) {
    if (error.message.includes('duplicate key')) {
      console.log('ℹ️  Sample data already exists\n');
    } else {
      console.error('❌ Seeding failed:', error.message);
    }
  }
}

async function main() {
  const isConnected = await testConnection();
  
  if (isConnected) {
    await seedData();
  }
}

main();
