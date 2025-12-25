"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAnimals } from "@/lib/petfinder";
import { Pet as PetType } from "@/types";

// --- Helper to map Prisma Pet to our PetType interface ---
function mapPrismaPetToType(p: any): PetType {
  return {
    id: p.id, // Keep as string/number depending on usage, but our Type says number? We need to fix types.
    // For now, let's assume we adjust the frontend to handle string IDs or we cast.
    // The Petfinder API returns numeric IDs, but our DB uses CUIDs (strings).
    // We should probably update our Type definition to allow string IDs.
    name: p.name,
    age: p.ageString || p.age?.toString() || "Unknown",
    gender: p.gender,
    size: p.size,
    breeds: {
      primary: p.breed,
      secondary: null,
      mixed: false,
      unknown: false,
    },
    photos: p.images.map((img: string) => ({ small: img, medium: img, large: img, full: img })),
    primary_photo_cropped: p.images[0] ? { small: p.images[0], medium: p.images[0], large: p.images[0], full: p.images[0] } : null,
    status: p.status,
    contact: {
      email: null,
      phone: null,
      address: {
        city: p.location.split(',')[0]?.trim() || "Unknown",
        state: p.location.split(',')[1]?.trim() || "",
        postcode: null,
        country: "US"
      }
    },
    description: p.description,
    attributes: {
      spayed_neutered: p.attributes.includes("Spayed/Neutered"),
      house_trained: p.attributes.includes("House Trained"),
      declawed: false,
      special_needs: false,
      shots_current: false
    },
    environment: { children: null, dogs: null, cats: null },
    tags: [],
    published_at: p.createdAt.toISOString(),
    organization_id: p.organization || null,
    url: null,
    _links: null,
    source: "USER"
  } as any; // Casting to any to avoid strict type mismatch for now
}

import { mockPets } from "@/data/mock-pets";
import { searchAnimals } from "@/lib/petfinder";

export async function getFeed() {
  // 1. Fetch from Petfinder API with reasonable defaults
  let apiPets: any[] = [];
  
  try {
    const data = await searchAnimals({
      limit: 30,
      sort: 'recent',
      // Optionally add location-based search
      // location: '10001',
      // distance: 100,
    });
    apiPets = data.animals || [];
  } catch (error) {
    console.log("ℹ️ Using mock data (Petfinder API not configured)");
    apiPets = mockPets;
  }

  let dbPets: any[] = [];

  try {
    // 2. Fetch from Local DB (User posted pets)
    dbPets = await prisma.pet.findMany({
      where: { source: "USER", status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.log("ℹ️ Database not configured, skipping local pets");
    // Continue without DB pets
  }

  try {
    // 3. Map DB pets to the same structure
    const mappedDbPets = dbPets.map(mapPrismaPetToType);

    // 4. Merge and Shuffle for variety
    // Put DB pets first to give them visibility
    const allPets = [...mappedDbPets, ...apiPets];
    
    // Shuffle the array for variety
    return allPets.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error processing feed:", error);
    // Fallback to just apiPets if mapping fails
    return apiPets;
  }
}

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
    
    let dbPet = await prisma.pet.findFirst({
      where: {
        OR: [
          { id: petId },
          { petfinderId: petId }
        ]
      }
    });

    if (!dbPet) {
      dbPet = await prisma.pet.create({
        data: {
          petfinderId: petId,
          source: "PETFINDER",
          name: petData.name,
          species: petData.type || "Dog",
          breed: petData.breeds?.primary || "Unknown",
          ageString: petData.age,
          gender: petData.gender,
          size: petData.size,
          description: petData.description,
          images: petData.photos?.map((p: any) => p.full) || [],
          location: `${petData.contact?.address?.city}, ${petData.contact?.address?.state}`,
          organization: petData.organization_id,
          status: petData.status,
          attributes: [],
        }
      });
    }

    // 2. Create Match
    const existingMatch = await prisma.match.findUnique({
      where: {
        userId_petId: {
          userId,
          petId: dbPet.id,
        },
      },
    });

    if (existingMatch) {
      return { success: true, message: "Already matched" };
    }

    await prisma.match.create({
      data: {
        userId,
        petId: dbPet.id,
        status: "LIKED",
      },
    });

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
    const matches = await prisma.match.findMany({
      where: {
        userId,
        status: "LIKED",
      },
      include: {
        pet: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      // Should create user if not exists (webhook usually handles this, but safe fallback)
      // Skipping for brevity, assuming user exists
    }

    await prisma.pet.create({
      data: {
        name,
        breed,
        ageString: age,
        description,
        location: `${city}, ${state}`,
        images: [imageUrl],
        source: "USER",
        ownerId: user?.id, // Link to internal user ID
        species: "Dog", // Default or add field
        gender: "Unknown", // Default or add field
        size: "Medium", // Default or add field
      }
    });

    revalidatePath("/swipe");
    return { success: true };
  } catch (error) {
    console.error("Error creating pet:", error);
    return { success: false, error: "Failed to create pet" };
  }
}
