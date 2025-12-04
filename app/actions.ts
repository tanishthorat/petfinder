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

export async function getFeed() {
  try {
    // 1. Fetch from Petfinder
    let apiPets: any[] = [];
    try {
      const data = await getAnimals({ limit: "20" });
      apiPets = data.animals || [];
    } catch (e) {
      console.error("Petfinder API failed:", e);
    }

    // 2. Fetch from Local DB (User posted pets)
    const dbPets = await prisma.pet.findMany({
      where: { source: "USER", status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // 3. Map DB pets to the same structure
    const mappedDbPets = dbPets.map(mapPrismaPetToType);

    // 4. Merge and Shuffle (simple merge for now)
    // Put DB pets first to give them visibility
    return [...mappedDbPets, ...apiPets];
  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
}

export async function likePet(petData: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // 1. Ensure Pet exists in DB
    // If it's a Petfinder pet, it might not be in our DB yet.
    let petId = petData.id.toString();
    
    // Check if it's an API pet (numeric ID usually) or DB pet (CUID string)
    // Or check if we passed a source flag.
    // Let's try to find it by petfinderId if it looks like one, or just ID.
    
    let dbPet = await prisma.pet.findFirst({
      where: {
        OR: [
          { id: petId },
          { petfinderId: petId }
        ]
      }
    });

    if (!dbPet) {
      // It's likely a Petfinder pet that hasn't been saved yet.
      // Create it.
      dbPet = await prisma.pet.create({
        data: {
          petfinderId: petId,
          source: "PETFINDER",
          name: petData.name,
          species: petData.type || "Dog", // Default
          breed: petData.breeds?.primary || "Unknown",
          ageString: petData.age,
          gender: petData.gender,
          size: petData.size,
          description: petData.description,
          images: petData.photos?.map((p: any) => p.full) || [],
          location: `${petData.contact?.address?.city}, ${petData.contact?.address?.state}`,
          organization: petData.organization_id,
          status: petData.status,
          attributes: [], // Map attributes if needed
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
    console.error("Error liking pet:", error);
    return { success: false, error: "Failed to like pet" };
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
    console.error("Error fetching matches:", error);
    return [];
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
