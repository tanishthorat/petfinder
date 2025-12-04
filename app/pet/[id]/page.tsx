import React from "react";
import { getAnimals } from "@/lib/petfinder";
import { mockPets } from "@/data/mock-pets";
import { Pet } from "@/types";
import PetDetails from "@/components/PetDetails";
import Link from "next/link";

export default async function PetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let pet: Pet | undefined;

  // Try to fetch from API, fallback to mock
  try {
    // Note: In a real app we'd have a getAnimal(id) function
    // For now we'll just look in mockPets since we might be using them
    pet = mockPets.find(p => p.id.toString() === id);
    
    if (!pet) {
      // If not in mock, try to fetch (this is just a placeholder logic)
      // const data = await getAnimal(id);
      // pet = data.animal;
    }
  } catch (error) {
    console.error("Error fetching pet:", error);
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
          <Link href="/swipe" className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return <PetDetails pet={pet} />;
}
