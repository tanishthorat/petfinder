"use server";

import { getUser } from "@/lib/supabase/server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { revalidatePath } from "next/cache";

// Helper: Get or create user from Supabase Auth
async function getCurrentUser() {
  const authUser = await getUser();
  if (!authUser) throw new Error("Unauthorized");

  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("id", authUser.id)
    .single();

  if (user) return user;

  // User doesn't exist in users table, create them
  console.log(`Creating new user record for auth user: ${authUser.id}`);
  
  const fullName = `${authUser.user_metadata?.first_name || ''} ${authUser.user_metadata?.last_name || ''}`.trim();

  const { data: newUser, error } = await supabase
    .from("users")
    .insert([
      {
        id: authUser.id,
        email: authUser.email || "",
        full_name: fullName || authUser.email, // Fallback to email if name is empty
        role: "adopter",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating user in Supabase:", error);
    throw new Error("Could not create user record");
  }

  return newUser;
}

export async function createPet(pet: {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  health_status: string;
  vaccination_status: boolean;
  is_neutered: boolean;
  good_with_kids: boolean;
  good_with_pets: boolean;
  images: string[];
  // Optional fields
  color?: string;
  coat?: string;
  city?: string;
  state?: string;
  special_needs?: string;
  medical_conditions?: string;
  good_with_cats?: boolean;
  good_with_dogs?: boolean;
  energy_level?: string;
  temperament?: string[];
  training_level?: string;
}) {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  if (!user || !user.id) {
    throw new Error("User not authenticated. Please sign in.");
  }

  // Build location address string (matches database schema)
  const location_address = pet.city && pet.state 
    ? `${pet.city}, ${pet.state}` 
    : null;

  // Normalize enum values to lowercase and ensure valid values
  const normalizedSpecies = pet.species?.toLowerCase();
  
  // Gender enum only allows 'male' or 'female'
  let normalizedGender = pet.gender?.toLowerCase();
  if (normalizedGender && !['male', 'female'].includes(normalizedGender)) {
    // Default to 'male' if invalid value provided
    console.warn(`Invalid gender value: ${normalizedGender}, defaulting to 'male'`);
    normalizedGender = 'male';
  }
  
  // Size enum: 'small', 'medium', 'large', 'extra_large'
  let normalizedSize = pet.size?.toLowerCase()?.replace(/\s+/g, '_');
  if (normalizedSize === 'extra-large' || normalizedSize === 'extra_large') {
    normalizedSize = 'extra_large';
  }
  if (normalizedSize && !['small', 'medium', 'large', 'extra_large'].includes(normalizedSize)) {
    // Default to 'medium' if invalid
    console.warn(`Invalid size value: ${normalizedSize}, defaulting to 'medium'`);
    normalizedSize = 'medium';
  }
  
  // Energy level enum: 'low', 'medium', 'high'
  let normalizedEnergyLevel = pet.energy_level?.toLowerCase() || null;
  if (normalizedEnergyLevel && !['low', 'medium', 'high'].includes(normalizedEnergyLevel)) {
    normalizedEnergyLevel = 'medium';
  }

  // Species enum: 'dog', 'cat', 'bird', 'rabbit', 'other'
  if (normalizedSpecies && !['dog', 'cat', 'bird', 'rabbit', 'other'].includes(normalizedSpecies)) {
    throw new Error(`Invalid species: ${normalizedSpecies}. Must be one of: dog, cat, bird, rabbit, other`);
  }

  // Validate required fields
  if (!pet.name || !normalizedSpecies || !pet.breed || pet.age === undefined || pet.age < 0 || !normalizedGender || !normalizedSize) {
    throw new Error("Missing required fields: name, species, breed, age (>= 0), gender, and size are required");
  }

  // Ensure images array is valid
  const imagesArray = Array.isArray(pet.images) && pet.images.length > 0 
    ? pet.images.filter(img => img && typeof img === 'string' && img.trim().length > 0)
    : null;

  if (!imagesArray || imagesArray.length === 0) {
    throw new Error("At least one image is required");
  }

  // Normalize enum values to lowercase
  const normalizedPet: Record<string, unknown> = {
    owner_id: user.id,
    name: pet.name.trim(),
    species: normalizedSpecies,
    breed: pet.breed.trim(),
    age: Math.max(0, Math.floor(pet.age)), // Ensure non-negative integer
    gender: normalizedGender,
    size: normalizedSize,
    description: pet.description?.trim() || null,
    health_status: pet.health_status?.trim() || null,
    vaccination_status: pet.vaccination_status === true || pet.vaccination_status === false ? pet.vaccination_status : null,
    is_neutered: pet.is_neutered === true || pet.is_neutered === false ? pet.is_neutered : null,
    good_with_kids: pet.good_with_kids === true || pet.good_with_kids === false ? pet.good_with_kids : null,
    good_with_pets: pet.good_with_pets === true || pet.good_with_pets === false ? pet.good_with_pets : null,
    images: imagesArray,
    color: pet.color?.trim() || null,
    location_address: location_address,
    special_needs: pet.special_needs?.trim() || null,
    energy_level: normalizedEnergyLevel,
    temperament: Array.isArray(pet.temperament) && pet.temperament.length > 0 ? pet.temperament : null,
    status: 'available',
  };

  // Only add optional fields if they have values
  if (pet.medical_conditions) {
    normalizedPet.special_needs = (normalizedPet.special_needs || '') + (normalizedPet.special_needs ? '\n' : '') + pet.medical_conditions;
  }

  // Log what we're trying to insert for debugging
  console.log("📝 Attempting to create pet with data:", {
    name: normalizedPet.name,
    species: normalizedPet.species,
    breed: normalizedPet.breed,
    age: normalizedPet.age,
    gender: normalizedPet.gender,
    size: normalizedPet.size,
    owner_id: normalizedPet.owner_id,
    images_count: imagesArray.length,
  });

  const { data, error } = await supabase.from("pets").insert([normalizedPet]).select().single();

  if (error) {
    console.error("❌ Database error creating pet:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      fullError: error,
    });
    
    // Provide more specific error messages
    if (error.code === '23505') {
      throw new Error("A pet with this information already exists");
    } else if (error.code === '23503') {
      throw new Error("Invalid owner ID. Please sign in again.");
    } else if (error.code === '23502') {
      throw new Error(`Missing required field: ${error.message}`);
    } else if (error.message?.includes('violates check constraint')) {
      throw new Error(`Invalid data: ${error.message}. Please check species, gender, or size values.`);
    } else {
      throw new Error(`Failed to create pet: ${error.message || 'Unknown database error'}`);
    }
  }

  console.log("✅ Pet created successfully:", data);
  revalidatePath("/profile");
  revalidatePath("/swipe");
  return data;
}

export async function getPetsForSwiping() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  console.log("DEBUG: Current user ID:", user.id);

  // Check total available pets in database
  const { count: totalAvailable } = await supabase
    .from("pets")
    .select("*", { count: "exact", head: true })
    .eq("status", "available");
  console.log("DEBUG: Total available pets in database:", totalAvailable);

  // Check how many pets are owned by current user
  const { count: ownedByUser } = await supabase
    .from("pets")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id);
  console.log("DEBUG: Pets owned by current user:", ownedByUser);

  // Get user preferences
  const { data: prefs, error: prefsError } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (prefsError && prefsError.code !== 'PGRST116') { // PGRST116 is 'no rows found'
    console.warn("Warning: No preferences found or error fetching preferences for user", user.id, prefsError);
  }

  console.log("DEBUG: User preferences:", prefs);

  // Get pets the user has already swiped on
  const { data: swipedPetIds, error: swipedError } = await supabase
    .from("swipes")
    .select("pet_id")
    .eq("user_id", user.id);
  
  if (swipedError) {
    console.error("Error fetching swiped pets:", swipedError);
    throw new Error("Could not fetch swiped pets");
  }
  
  const swipedIds = swipedPetIds?.map(s => s.pet_id) || [];
  console.log("DEBUG: Swiped pet IDs count:", swipedIds.length);

  let query = supabase
    .from("pets")
    .select("*")
    .eq("status", "available")
    .neq("owner_id", user.id); // Exclude user's own pets

  // Exclude already swiped pets
  if (swipedIds.length > 0) {
    query = query.not("id", "in", `(${swipedIds.join(',')})`);
  }

  // Apply preferences as filters - BUT ONLY IF THEY EXIST AND ARE NOT EMPTY
  if (prefs) {
    if (prefs.species?.length) {
      console.log("DEBUG: Filtering by species:", prefs.species);
      // Convert species to lowercase to match enum values
      const speciesLowercase = (prefs.species as string[]).map(s => s.toLowerCase());
      query = query.in("species", speciesLowercase);
    }
    if (prefs.age_min !== null && prefs.age_min !== undefined) {
      console.log("DEBUG: Filtering by age_min:", prefs.age_min);
      query = query.gte("age", prefs.age_min);
    }
    if (prefs.age_max !== null && prefs.age_max !== undefined) {
      console.log("DEBUG: Filtering by age_max:", prefs.age_max);
      query = query.lte("age", prefs.age_max);
    }
    if (prefs.size?.length) {
      console.log("DEBUG: Filtering by size:", prefs.size);
      // Convert size to lowercase to match enum values
      const sizeLowercase = (prefs.size as string[]).map(s => s.toLowerCase());
      query = query.in("size", sizeLowercase);
    }
  }

  const { data: pets, error: petsError } = await query.limit(20);

  if (petsError) {
    console.error("Error fetching pets for swiping:", petsError);
    throw new Error("Failed to fetch pets");
  }

  console.log("DEBUG: Final fetched pets count:", pets?.length);
  if (pets) {
    console.log("DEBUG: Pet IDs returned:", pets.map(p => p.id));
  }
  return pets || [];
}

export async function recordSwipe(petId: string, direction: "left" | "right") {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from("swipes").insert([
    {
      user_id: user.id,
      pet_id: petId,
      direction,
    },
  ]);

  if (error) {
    console.error("Error recording swipe:", error);
    // Don't throw, as it's not critical if a swipe fails to record
  }
  
  if (direction === 'right') {
    // Check for a match
    const { data: pet } = await supabase.from('pets').select('owner_id').eq('id', petId).single();
    if (pet) {
      await supabase.from('matches').insert([{
        adopter_id: user.id,
        pet_id: petId,
        owner_id: pet.owner_id
      }]);
      // Here you could trigger a notification
    }
  }

  return data;
}

export async function getSwipeHistory() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data: swipes, error } = await supabase
    .from("swipes")
    .select("*, pet:pets(*)")
    .eq("user_id", user.id)
    .order("swiped_at", { ascending: false });

  if (error) {
    console.error("Error fetching swipe history:", error);
    throw new Error("Failed to fetch swipe history");
  }
  return swipes;
}

export async function getLikedPets() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data: likedSwipes, error } = await supabase
    .from("swipes")
    .select("pet:pets(*)")
    .eq("user_id", user.id)
    .eq("direction", "right");

  if (error) {
    console.error("Error fetching liked pets:", error);
    throw new Error("Failed to fetch liked pets");
  }
  
  // We need to filter out pets that are already matched
  const { data: matches } = await supabase.from("matches").select("pet_id").eq("adopter_id", user.id);
  const matchedPetIds = matches?.map(m => m.pet_id) || [];
  
  const likedPets = likedSwipes
    .map(s => {
      // Handle case where pet might be an array or single object
      const pet = Array.isArray(s.pet) ? s.pet[0] : s.pet;
      return pet;
    })
    .filter((p): p is NonNullable<typeof p> => {
      return p !== null && p !== undefined && typeof p === 'object' && 'id' in p && !matchedPetIds.includes(p.id);
    });

  return likedPets;
}

export async function searchPets(filters: { [key: string]: unknown }) {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("pets").select("*").eq("status", "available");

  if (filters.species) {
    query = query.eq("species", filters.species);
  }
  if (filters.breed) {
    query = query.ilike("breed", `%${filters.breed}%`);
  }
  if (filters.size) {
    const sizes = Array.isArray(filters.size) ? filters.size : [filters.size];
    query = query.in("size", sizes);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error searching pets:", error);
    throw new Error("Failed to search pets");
  }

  return data;
}

// Admin function to get all pets (for debugging)
export async function getAllPets() {
  const supabase = await createSupabaseServerClient();
  const { data: pets, error } = await supabase
    .from("pets")
    .select("id, name, species, breed, size, status, owner_id, age")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all pets:", error);
    throw new Error("Failed to fetch all pets");
  }

  console.log("DEBUG: All pets in database:", pets);
  return pets || [];
}

export async function getMyPets() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  // Get all pets owned by the user
  const { data: pets, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching my pets:", error);
    throw new Error("Failed to fetch your pets");
  }

  if (!pets || pets.length === 0) {
    return [];
  }

  // For each pet, get like count and users who liked it
  const petsWithLikes = await Promise.all(
    pets.map(async (pet) => {
      // Get all right swipes (likes) for this pet
      const { data: likes, error: likesError } = await supabase
        .from("swipes")
        .select("*")
        .eq("pet_id", pet.id)
        .eq("direction", "right");

      if (likesError) {
        console.error(`Error fetching likes for pet ${pet.id}:`, likesError);
      }

      // Get user details for each like
      const likesWithUsers = await Promise.all(
        (likes || []).map(async (like) => {
          const { data: userData } = await supabase
            .from("users")
            .select("id, full_name, email, profile_image_url")
            .eq("id", like.user_id)
            .single();
          
          return {
            id: like.id,
            user_id: like.user_id,
            swiped_at: like.swiped_at,
            user: userData || null
          };
        })
      );

      // Get matches for this pet (users who liked and we matched with)
      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .eq("pet_id", pet.id)
        .eq("owner_id", user.id);

      if (matchesError) {
        console.error(`Error fetching matches for pet ${pet.id}:`, matchesError);
      }

      // Get adopter details for each match
      const matchesWithAdopters = await Promise.all(
        (matches || []).map(async (match) => {
          const { data: adopterData } = await supabase
            .from("users")
            .select("id, full_name, email, profile_image_url")
            .eq("id", match.adopter_id)
            .single();
          
          return {
            id: match.id,
            adopter_id: match.adopter_id,
            status: match.status,
            matched_at: match.matched_at,
            adopter: adopterData || null
          };
        })
      );

      // Get users who liked but haven't matched yet (potential contacts)
      const likedUserIds = likesWithUsers.map(l => l.user_id);
      const matchedUserIds = matchesWithAdopters.map(m => m.adopter_id);
      const potentialContacts = likedUserIds.filter(id => !matchedUserIds.includes(id));

      // Get user details for potential contacts
      const potentialContactUsers = await Promise.all(
        potentialContacts.map(async (userId) => {
          const { data: userData } = await supabase
            .from("users")
            .select("id, full_name, email, profile_image_url")
            .eq("id", userId)
            .single();
          return userData;
        })
      );

      return {
        ...pet,
        likeCount: likesWithUsers.length,
        likes: likesWithUsers,
        matches: matchesWithAdopters,
        potentialContacts: potentialContactUsers.filter(u => u !== null)
      };
    })
  );

  return petsWithLikes;
}
