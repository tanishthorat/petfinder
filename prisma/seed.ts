// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pets = [
  {
    name: "Bella",
    species: "Dog",
    breed: "Golden Retriever",
    age: 2,
    gender: "Female",
    size: "Large",
    color: "Golden",
    attributes: ["Spayed/Neutered", "House Trained"],
    description: "Friendly and energetic, loves playing fetch!",
    images: ["https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop"],
    location: "New York, NY",
    organization: "Happy Paws Shelter",
    distance: 2.5,
    status: "AVAILABLE",
  },
  {
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    age: 1,
    gender: "Male",
    size: "Medium",
    color: "Tricolor",
    attributes: ["Vaccinated"],
    description: "Curious puppy looking for a loving home.",
    images: ["https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=600&auto=format&fit=crop"],
    location: "Brooklyn, NY",
    organization: "Brooklyn Animal Rescue",
    distance: 5.1,
    status: "AVAILABLE",
  },
  {
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    age: 3,
    gender: "Female",
    size: "Small",
    color: "Cream",
    attributes: ["Spayed/Neutered", "House Trained", "Declawed"],
    description: "Calm and affectionate, loves naps.",
    images: ["https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=600&auto=format&fit=crop"],
    location: "Queens, NY",
    organization: "Queens Cat Sanctuary",
    distance: 8.0,
    status: "AVAILABLE",
  },
  {
    name: "Max",
    species: "Dog",
    breed: "German Shepherd",
    age: 4,
    gender: "Male",
    size: "Large",
    color: "Black & Tan",
    attributes: ["Spayed/Neutered", "Vaccinated", "Special Needs"],
    description: "Loyal protector and great hiking buddy.",
    images: ["https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=600&auto=format&fit=crop"],
    location: "Jersey City, NJ",
    organization: "Jersey City Shelter",
    distance: 4.2,
    status: "AVAILABLE",
  },
  {
    name: "Daisy",
    species: "Dog",
    breed: "French Bulldog",
    age: 2,
    gender: "Female",
    size: "Small",
    color: "Fawn",
    attributes: ["House Trained"],
    description: "Playful and loves belly rubs.",
    images: ["https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop"],
    location: "Hoboken, NJ",
    organization: "Hoboken Paws",
    distance: 3.8,
    status: "AVAILABLE",
  },
  {
    name: "Oliver",
    species: "Cat",
    breed: "Maine Coon",
    age: 5,
    gender: "Male",
    size: "Large",
    color: "Tabby",
    attributes: ["Spayed/Neutered", "House Trained"],
    description: "Gentle giant who loves to cuddle.",
    images: ["https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600&auto=format&fit=crop"],
    location: "Manhattan, NY",
    organization: "City Kitties",
    distance: 1.2,
    status: "AVAILABLE",
  },
  {
    name: "Rocky",
    species: "Dog",
    breed: "Boxer",
    age: 3,
    gender: "Male",
    size: "Large",
    color: "Brindle",
    attributes: ["Vaccinated"],
    description: "Energetic and loves to run.",
    images: ["https://images.unsplash.com/photo-1543071220-6ee5bf71a54e?q=80&w=600&auto=format&fit=crop"],
    location: "Bronx, NY",
    organization: "Bronx Tails",
    distance: 10.5,
    status: "AVAILABLE",
  },
  {
    name: "Milo",
    species: "Cat",
    breed: "Persian",
    age: 2,
    gender: "Male",
    size: "Medium",
    color: "White",
    attributes: ["House Trained"],
    description: "Fluffy and regal, needs daily grooming.",
    images: ["https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop"],
    location: "Staten Island, NY",
    organization: "Island Cats",
    distance: 15.0,
    status: "AVAILABLE",
  }
];

async function main() {
  console.log("Start seeding ...");
  for (const pet of pets) {
    const result = await prisma.pet.create({
      data: pet,
    });
    console.log(`Created pet with id: ${result.id}`);
  }
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
