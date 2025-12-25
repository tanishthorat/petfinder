// Petfinder API Usage Examples for PetPro
// Copy and paste these examples into your components

import { searchAnimals, getAnimal, getBreeds, getTypes } from '@/lib/petfinder';

// ============================================
// EXAMPLE 1: Basic Search
// ============================================
async function basicSearch() {
  const data = await searchAnimals({
    type: 'dog',
    limit: 20
  });
  
  console.log(`Found ${data.animals.length} dogs`);
  return data.animals;
}

// ============================================
// EXAMPLE 2: Location-Based Search
// ============================================
async function locationSearch(zipCode: string, miles: number = 50) {
  const data = await searchAnimals({
    type: 'dog',
    location: zipCode,
    distance: miles,
    limit: 30
  });
  
  return data.animals;
}

// ============================================
// EXAMPLE 3: Advanced Filters
// ============================================
async function advancedSearch() {
  const data = await searchAnimals({
    type: 'dog',
    breed: ['labrador-retriever', 'golden-retriever'],
    age: ['young', 'adult'],
    size: ['medium', 'large'],
    gender: 'female',
    good_with_children: true,
    good_with_dogs: true,
    house_trained: true,
    location: '10001',
    distance: 100,
    limit: 50,
    sort: 'recent'
  });
  
  return data.animals;
}

// ============================================
// EXAMPLE 4: Paginated Results
// ============================================
async function paginatedSearch(page: number = 1) {
  const data = await searchAnimals({
    type: 'cat',
    location: '90210',
    distance: 50,
    page: page,
    limit: 20
  });
  
  console.log(`Page ${data.pagination.current_page} of ${data.pagination.total_pages}`);
  console.log(`Showing ${data.animals.length} of ${data.pagination.total_count} total cats`);
  
  return {
    pets: data.animals,
    pagination: data.pagination
  };
}

// ============================================
// EXAMPLE 5: Get Single Pet Details
// ============================================
async function getPetDetails(petId: string) {
  try {
    const data = await getAnimal(petId);
    const pet = data.animal;
    
    console.log(`${pet.name} - ${pet.breeds.primary}`);
    console.log(`Age: ${pet.age}, Size: ${pet.size}`);
    console.log(`Location: ${pet.contact.address.city}, ${pet.contact.address.state}`);
    
    return pet;
  } catch (error) {
    console.error('Pet not found');
    return null;
  }
}

// ============================================
// EXAMPLE 6: Get All Dog Breeds
// ============================================
async function getDogBreeds() {
  const data = await getBreeds('dog');
  const breeds = data.breeds;
  
  console.log(`Found ${breeds.length} dog breeds`);
  breeds.forEach((breed: any) => {
    console.log(breed.name);
  });
  
  return breeds;
}

// ============================================
// EXAMPLE 7: Search for Adoptable Cats Near User
// ============================================
async function searchNearbyCats(userZipCode: string) {
  const data = await searchAnimals({
    type: 'cat',
    location: userZipCode,
    distance: 25,
    age: ['young', 'adult'],
    good_with_children: true,
    limit: 30,
    sort: 'distance'
  });
  
  return data.animals.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    breed: cat.breeds.primary,
    age: cat.age,
    photo: cat.primary_photo_cropped?.medium || cat.photos[0]?.medium,
    location: `${cat.contact.address.city}, ${cat.contact.address.state}`,
    distance: cat.distance || 'Unknown'
  }));
}

// ============================================
// EXAMPLE 8: Filter for Senior Pets
// ============================================
async function searchSeniorPets(location: string) {
  const data = await searchAnimals({
    age: ['senior'],
    location: location,
    distance: 100,
    limit: 50
  });
  
  return data.animals;
}

// ============================================
// EXAMPLE 9: Search by Multiple Criteria
// ============================================
async function familyFriendlyPets(zipCode: string) {
  const data = await searchAnimals({
    type: 'dog',
    size: ['small', 'medium'],
    good_with_children: true,
    good_with_dogs: true,
    house_trained: true,
    location: zipCode,
    distance: 50,
    limit: 30
  });
  
  return data.animals;
}

// ============================================
// EXAMPLE 10: Client-Side Fetch via API Route
// ============================================
async function clientSideSearch(filters: any) {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else if (value) {
      params.append(key, String(value));
    }
  });
  
  const response = await fetch(`/api/pets?${params.toString()}`);
  const data = await response.json();
  
  return data.animals;
}

// ============================================
// EXAMPLE 11: React Component with Search
// ============================================
/*
'use client';

import { useState, useEffect } from 'react';

export function PetSearch() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const searchPets = async (filters) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pets?${new URLSearchParams(filters)}`);
      const data = await response.json();
      setPets(data.animals || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    searchPets({ type: 'dog', limit: 20 });
  }, []);
  
  return (
    <div>
      {loading ? (
        <p>Loading pets...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {pets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
*/

// ============================================
// EXAMPLE 12: Server Component with Filters
// ============================================
/*
// app/pets/page.tsx
import { searchAnimals } from '@/lib/petfinder';

export default async function PetsPage({ searchParams }) {
  const filters = {
    type: searchParams.type || 'dog',
    age: searchParams.age ? [searchParams.age] : undefined,
    location: searchParams.location,
    distance: searchParams.distance ? parseInt(searchParams.distance) : 50
  };
  
  const data = await searchAnimals(filters);
  
  return (
    <div>
      <h1>Available Pets</h1>
      <p>Found {data.pagination.total_count} pets</p>
      {data.animals.map(pet => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
*/

// ============================================
// EXAMPLE 13: Get Random Pet for "Featured"
// ============================================
async function getRandomPet() {
  const data = await searchAnimals({
    limit: 100,
    sort: 'recent'
  });
  
  if (data.animals.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.animals.length);
    return data.animals[randomIndex];
  }
  
  return null;
}

// ============================================
// EXAMPLE 14: Search All Animal Types
// ============================================
async function getAllTypes() {
  const data = await getTypes();
  return data.types; // Returns: dog, cat, rabbit, bird, etc.
}

// ============================================
// EXAMPLE 15: Complex Multi-Filter Search
// ============================================
async function dreamPetSearch(preferences: {
  type: string;
  location: string;
  maxDistance: number;
  mustHaves: string[];
}) {
  const filters: any = {
    type: preferences.type,
    location: preferences.location,
    distance: preferences.maxDistance,
    limit: 50,
    sort: 'distance'
  };
  
  // Add "must have" features
  if (preferences.mustHaves.includes('good-with-kids')) {
    filters.good_with_children = true;
  }
  if (preferences.mustHaves.includes('good-with-dogs')) {
    filters.good_with_dogs = true;
  }
  if (preferences.mustHaves.includes('house-trained')) {
    filters.house_trained = true;
  }
  
  const data = await searchAnimals(filters);
  return data.animals;
}

// ============================================
// USAGE IN YOUR APP
// ============================================

/*
// In your swipe page
export default async function SwipePage() {
  const pets = await searchAnimals({
    type: 'dog',
    location: '10001',
    distance: 50,
    limit: 30
  });
  
  return <SwipeClient initialPets={pets.animals} />;
}

// In your search page
export default async function SearchPage({ searchParams }) {
  const data = await searchAnimals({
    type: searchParams.type,
    age: searchParams.age,
    size: searchParams.size,
    location: searchParams.location || '10001',
    distance: parseInt(searchParams.distance || '50'),
    page: parseInt(searchParams.page || '1'),
    limit: 20
  });
  
  return <SearchClient pets={data.animals} pagination={data.pagination} />;
}
*/

export {
  basicSearch,
  locationSearch,
  advancedSearch,
  paginatedSearch,
  getPetDetails,
  getDogBreeds,
  searchNearbyCats,
  searchSeniorPets,
  familyFriendlyPets,
  clientSideSearch,
  getRandomPet,
  getAllTypes,
  dreamPetSearch
};
