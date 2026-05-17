import { PrismaClient } from "@prisma/client";
import { Role, Species, Gender, Size, EnergyLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.userPreferences.deleteMany();
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding new data...");

  // Create Users
  const adopterUser = await prisma.user.create({
    data: {
      clerk_user_id: "user_adopter_clerk_id",
      email: "adopter@example.com",
      full_name: "Adopter Alice",
      role: Role.adopter,
      profile_image_url: "https://randomuser.me/api/portraits/women/1.jpg",
      bio: "Looking for a furry friend to join my family.",
      location_lat: 40.7128,
      location_lng: -74.006,
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      clerk_user_id: "user_owner_clerk_id",
      email: "owner@example.com",
      full_name: "Owner Bob",
      role: Role.owner,
      profile_image_url: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "Have some lovely pets that need a new home.",
      location_lat: 40.730610,
      location_lng: -73.935242,
    },
  });

  // Create Pets
  const pet1 = await prisma.pet.create({
    data: {
      owner_id: ownerUser.id,
      name: "Bella",
      species: Species.dog,
      breed: "Golden Retriever",
      age: 24, // months
      gender: Gender.female,
      size: Size.large,
      color: "Golden",
      description: "Friendly and energetic, loves playing fetch!",
      health_status: "Healthy",
      vaccination_status: true,
      is_neutered: true,
      good_with_kids: true,
      good_with_pets: true,
      energy_level: EnergyLevel.high,
      temperament: ["friendly", "playful", "energetic"],
      images: ["https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop"],
      location_lat: 40.730610,
      location_lng: -73.935242,
      location_address: "123 Bark St, Brooklyn, NY",
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      owner_id: ownerUser.id,
      name: "Charlie",
      species: Species.dog,
      breed: "Beagle",
      age: 12,
      gender: Gender.male,
      size: Size.medium,
      color: "Tricolor",
      description: "Curious puppy looking for a loving home.",
      health_status: "Up to date on all shots",
      vaccination_status: true,
      is_neutered: false,
      good_with_kids: true,
      good_with_pets: true,
      energy_level: EnergyLevel.medium,
      temperament: ["curious", "playful"],
      images: ["https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=600&auto=format&fit=crop"],
      location_lat: 40.730610,
      location_lng: -73.935242,
      location_address: "456 Fetch Ave, Brooklyn, NY",
    },
  });

    const pet3 = await prisma.pet.create({
    data: {
      owner_id: ownerUser.id,
      name: "Luna",
      species: Species.cat,
      breed: "Siamese",
      age: 36,
      gender: Gender.female,
      size: Size.small,
      color: "Cream",
      description: "Calm and affectionate, loves naps.",
      health_status: "Healthy",
      vaccination_status: true,
      is_neutered: true,
      good_with_kids: true,
      good_with_pets: false,
      energy_level: EnergyLevel.low,
      temperament: ["calm", "affectionate"],
      images: ["https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=600&auto=format&fit=crop"],
      location_lat: 40.730610,
      location_lng: -73.935242,
      location_address: "789 Meow Ln, Queens, NY",
    },
  });

  // Create User Preferences
  await prisma.userPreferences.create({
    data: {
      user_id: adopterUser.id,
      species: [Species.dog, Species.cat],
      age_min: 6,
      age_max: 60,
      size: [Size.medium, Size.large],
      gender: [Gender.male, Gender.female],
      distance_km: 25,
      good_with_kids: true,
      energy_level: [EnergyLevel.medium, EnergyLevel.high],
    },
  });

  // Create Swipes
  await prisma.swipe.create({
    data: {
      user_id: adopterUser.id,
      pet_id: pet1.id,
      direction: "right",
    },
  });

  await prisma.swipe.create({
    data: {
      user_id: adopterUser.id,
      pet_id: pet2.id,
      direction: "left",
    },
  });

    await prisma.swipe.create({
    data: {
      user_id: adopterUser.id,
      pet_id: pet3.id,
      direction: "right",
    },
  });

  // Create a Match
  const match = await prisma.match.create({
      data: {
          adopter_id: adopterUser.id,
          pet_id: pet1.id,
          owner_id: ownerUser.id,
      }
  });

  // Create messages for the match
  await prisma.message.create({
      data: {
          match_id: match.id,
          sender_id: adopterUser.id,
          message: "Hi! I'm very interested in Bella. Could we schedule a meeting?",
      }
  });

    await prisma.message.create({
      data: {
          match_id: match.id,
          sender_id: ownerUser.id,
          message: "Of course! We are available this weekend. Does Saturday work for you?",
      }
  });


  console.log("Database has been seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
