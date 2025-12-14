"use client";

import React, { useState } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { Pet } from "@/types";
import { Button } from "@nextui-org/react";
import { Heart, X, RotateCcw, MessageCircle, User, MapPin } from "lucide-react";
import Link from "next/link";
import { likePet } from "@/app/actions";
import { toast } from "sonner";

interface SwipeClientProps {
  initialPets: Pet[];
}

export default function SwipeClient({ initialPets }: SwipeClientProps) {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [lastRemovedPet, setLastRemovedPet] = useState<Pet | null>(null);

  const handleSwipe = async (direction: "left" | "right", id: number) => {
    const petToRemove = pets.find((p) => p.id === id);
    if (petToRemove) {
      setLastRemovedPet(petToRemove);
      setPets((prev) => prev.filter((p) => p.id !== id));

      if (direction === "right") {
        try {
          // Pass the full pet object to likePet so it can be saved if needed
          const result = await likePet(petToRemove);
          if (result.success) {
            toast.success(`You liked ${petToRemove.name}!`);
          } else {
            console.error(result.message);
          }
        } catch (error) {
          console.error("Failed to like pet:", error);
        }
      }
    }
  };

  const handleUndo = () => {
    if (lastRemovedPet) {
      setPets((prev) => [...prev, lastRemovedPet]);
      setLastRemovedPet(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 overflow-hidden relative">
      {/* Card Stack */}
      <main className="flex-1 flex items-center justify-center relative w-full max-w-md mx-auto my-4">
        <div className="relative w-full h-[600px] flex items-center justify-center">
          {pets.length > 0 ? (
            pets.map((pet, index) => (
              <SwipeCard
                key={pet.id}
                pet={pet}
                active={index === pets.length - 1} // Only top card is active
                onSwipe={(dir) => handleSwipe(dir, pet.id)}
              />
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <User size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">No more pets nearby!</h3>
              <p className="text-gray-600 mb-8">Check back later for more furry friends.</p>
              <Button 
                color="primary" 
                size="lg"
                className="font-semibold shadow-lg shadow-primary/30"
                onPress={() => window.location.reload()}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="pb-8 pt-2 px-4 flex justify-center items-center gap-8 z-20">
        <Button 
          isIconOnly 
          radius="full" 
          size="lg" 
          className="bg-white shadow-xl text-yellow-500 w-14 h-14 hover:scale-110 transition-transform"
          onPress={handleUndo}
          isDisabled={!lastRemovedPet}
        >
          <RotateCcw size={24} />
        </Button>
        
        <Button 
          isIconOnly 
          radius="full" 
          size="lg" 
          className="bg-white shadow-xl text-red-500 w-20 h-20 hover:scale-110 transition-transform border-4 border-transparent hover:border-red-100"
          onPress={() => pets.length > 0 && handleSwipe("left", pets[pets.length - 1].id)}
        >
          <X size={40} />
        </Button>
        
        <Button 
          isIconOnly 
          radius="full" 
          size="lg" 
          className="bg-white shadow-xl text-green-500 w-20 h-20 hover:scale-110 transition-transform border-4 border-transparent hover:border-green-100"
          onPress={() => pets.length > 0 && handleSwipe("right", pets[pets.length - 1].id)}
        >
          <Heart size={40} fill="currentColor" />
        </Button>
        
        <Link href="/map">
          <Button 
            isIconOnly 
            radius="full" 
            size="lg" 
            className="bg-white shadow-xl text-purple-500 w-14 h-14 hover:scale-110 transition-transform"
          >
            <MapPin size={24} />
          </Button>
        </Link>
      </footer>
    </div>
  );
}
