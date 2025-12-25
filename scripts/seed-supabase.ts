import { supabase } from '../lib/supabaseClient';
import { mockPets } from '../data/mock-pets';

async function seed() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_KEY) {
    console.error('Supabase keys not found in environment. Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY.');
    process.exit(1);
  }

  try {
    const rows = mockPets.map((p: any) => ({
      id: String(p.id),
      petfinder_id: String(p.id),
      source: 'PETFINDER',
      name: p.name,
      species: p.species,
      breed: p.breeds?.primary || null,
      age_string: p.age || null,
      gender: p.gender || null,
      size: p.size || null,
      color: p.colors?.primary || null,
      images: p.photos?.map((ph: any) => ph.full) || [],
      description: p.description || null,
      location: p.contact?.address ? `${p.contact.address.city}, ${p.contact.address.state}` : null,
    }));

    // Upsert into `pets` table on id
    const { data, error } = await supabase.from('pets').upsert(rows, { onConflict: 'id' }).select();
    if (error) {
      console.error('Seed error:', error);
      process.exit(1);
    }

    console.log(`Seeded ${data?.length ?? rows.length} pets into Supabase`);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error seeding Supabase:', err);
    process.exit(1);
  }
}

seed();
