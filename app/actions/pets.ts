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
}) {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from("pets").insert([
    {
      owner_id: user.id,
      ...pet,
    },
  ]);

  if (error) {
    console.error("Error creating pet:", error);
    throw new Error("Failed to create pet");
  }

  revalidatePath("/my-pets");
  return data;
}

export async function getPetsForSwiping() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  console.log("DEBUG: Current user ID:", user.id);

  // Get user preferences
  const { data: prefs, error: prefsError } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (prefsError && prefsError.code !== 'PGRST116') { // PGRST116 is 'no rows found'
    console.warn("Warning: No preferences found or error fetching preferences for user", user.id, prefsError);
  }

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
  console.log("DEBUG: Swiped pet IDs:", swipedIds);

  let query = supabase
    .from("pets")
    .select("*")
    .eq("status", "available")
    .neq("owner_id", user.id); // Exclude user's own pets

  // Exclude already swiped pets
  if (swipedIds.length > 0) {
    query = query.not("id", "in", `(${swipedIds.join(',')})`);
  }

  // Apply preferences as filters
  if (prefs) {
    console.log("DEBUG: Applying preferences:", prefs);
    if (prefs.species?.length) {
      query = query.in("species", prefs.species as string[]); // Cast to string[]
    }
    if (prefs.age_min) query = query.gte("age", prefs.age_min);
    if (prefs.age_max) query = query.lte("age", prefs.age_max);
    if (prefs.size?.length) {
      query = query.in("size", prefs.size as string[]); // Cast to string[]
    }
  }

  const { data: pets, error: petsError } = await query.limit(20);

  if (petsError) {
    console.error("Error fetching pets for swiping:", petsError);
    throw new Error("Failed to fetch pets");
  }

  console.log("DEBUG: Fetched pets count:", pets?.length);
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
    .map(s => s.pet)
    .filter(p => p && !matchedPetIds.includes(p.id));

  return likedPets;
}

export async function searchPets(filters: { [key: string]: any }) {
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
