import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qdmpdrjeyuikpbvzdufa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbXBkcmpleXVpa3BidnpkdWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjY4MTM2MSwiZXhwIjoyMDgyMjU3MzYxfQ.O7H4txxzbF7KqDGife3d_dsE8EbSiRNRYmhbS1Y7tv0';

console.log('🔍 Testing Supabase connection...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test connection by checking if users table exists
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      if (error.message.includes('relation "users" does not exist') || error.code === '42P01') {
        console.log('⚠️  Database tables not found. You need to run the schema SQL.\n');
        console.log('📋 To set up your database:');
        console.log('1. Go to: https://supabase.com/dashboard/project/qdmpdrjeyuikpbvzdufa');
        console.log('2. Go to SQL Editor');
        console.log('3. Open the file: supabase-schema.sql');
        console.log('4. Copy all contents and paste into SQL Editor');
        console.log('5. Click RUN to execute\n');
        return false;
      }
      throw error;
    }

    console.log('✅ Successfully connected to Supabase database!');
    console.log('✅ Database schema is set up correctly!\n');
    return true;
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('- Check your internet connection');
    console.log('- Verify Supabase project is active');
    console.log('- Confirm credentials in .env file\n');
    return false;
  }
}

async function seedData() {
  console.log('🌱 Seeding sample data...\n');

  try {
    // Check if sample data already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', 'user_adopter_sample');

    if (existingUsers && existingUsers.length > 0) {
      console.log('ℹ️  Sample data already exists\n');
      return;
    }

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

    // Get owner for foreign key
    const { data: users } = await supabase
      .from('users')
      .select('id, clerk_user_id');

    const ownerId = users?.find(u => u.clerk_user_id === 'user_owner_sample')?.id;

    if (ownerId) {
      // Create sample pets
      const { error: petsError } = await supabase
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
        ]);

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
    console.log('✨ All done! Your database is ready.\n');
    console.log('📝 Next steps:');
    console.log('- Run: npm run dev');
    console.log('- Visit: http://localhost:3000\n');
  }
}

main();
