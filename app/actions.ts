"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { getAnimals } from "@/lib/petfinder";
import { Pet as PetType } from "@/types";

// --- In-Memory Fallback Store ---
const globalForMatches = global as unknown as { mockMatchesStore: any[] };
if (!globalForMatches.mockMatchesStore) globalForMatches.mockMatchesStore = [];
const mockMatchesStore = globalForMatches.mockMatchesStore;

export async function likePet(petData: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // 1. Ensure Pet exists in DB
    let petId = petData.id.toString();
    
    let { data: dbPet } = await supabase
      .from('pets')
      .select('*')
      .or(`id.eq.${petId},petfinder_id.eq.${petId}`)
      .single();

    if (!dbPet) {
      const { data, error } = await supabase
        .from('pets')
        .insert([
          {
            petfinder_id: petId,
            source: "PETFINDER",
            name: petData.name,
            species: petData.type || "Dog",
            breed: petData.breeds?.primary || "Unknown",
            age_string: petData.age,
            gender: petData.gender,
            size: petData.size,
            description: petData.description,
            images: petData.photos?.map((p: any) => p.full) || [],
            location: `${petData.contact?.address?.city}, ${petData.contact?.address?.state}`,
            organization: petData.organization_id,
            status: petData.status,
            attributes: [],
          },
        ])
        .select();
      if (error) throw error;
      dbPet = data?.[0];
    }

    // 2. Create Match
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('*')
      .eq('user_id', userId)
      .eq('pet_id', dbPet.id)
      .single();

    if (existingMatch) {
      return { success: true, message: "Already matched" };
    }

    await supabase.from('matches').insert([
      {
        user_id: userId,
        pet_id: dbPet.id,
        status: "LIKED",
      },
    ]);

    revalidatePath("/matches");
    return { success: true, message: "Matched!" };
  } catch (error) {
    console.log("Database error in likePet, falling back to in-memory store:", error);
    
    // Fallback: Save to in-memory store
    const existingMatch = mockMatchesStore.find((m: any) => m.userId === userId && m.petId === petData.id);
    if (existingMatch) {
      return { success: true, message: "Already matched (Fallback)" };
    }

    mockMatchesStore.push({
      id: `mock-match-${Date.now()}`,
      userId,
      petId: petData.id,
      status: "LIKED",
      createdAt: new Date(),
      pet: {
        ...petData,
        images: petData.photos?.map((p: any) => p.full) || [],
        location: `${petData.contact?.address?.city}, ${petData.contact?.address?.state}`,
      }
    });

    revalidatePath("/matches");
    return { success: true, message: "Matched! (Fallback)" };
  }
}

export async function getMatches() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*, pets(*)')
      .eq('user_id', userId)
      .eq('status', 'LIKED')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return matches;
  } catch (error) {
    console.log("Database error in getMatches, falling back to in-memory store:", error);
    // Fallback: Filter from in-memory store
    return mockMatchesStore
      .filter((m: any) => m.userId === userId && m.status === "LIKED")
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function createPet(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const name = formData.get("name") as string;
    const breed = formData.get("breed") as string;
    const age = formData.get("age") as string;
    const description = formData.get("description") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    // Handle image upload - for now assuming a URL string or we'd need an upload service (e.g. UploadThing/S3)
    // For this demo, we'll use a placeholder or expect a URL input.
    const imageUrl = formData.get("imageUrl") as string || "https://via.placeholder.com/600x600";

    // Find or create user to link
    let { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      // Should create user if not exists (webhook usually handles this, but safe fallback)
      // Skipping for brevity, assuming user exists
    }

    await supabase.from('pets').insert([
      {
        name,
        breed,
        age_string: age,
        description,
        location: `${city}, ${state}`,
        images: [imageUrl],
        source: "USER",
        owner_id: user?.id, // Link to internal user ID
        species: "Dog", // Default or add field
        gender: "Unknown", // Default or add field
        size: "Medium", // Default or add field
      },
    ]);

    revalidatePath("/swipe");
    return { success: true };
  } catch (error) {
    console.error("Error creating pet:", error);
    return { success: false, error: "Failed to create pet" };
  }
}

