"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { X, Heart, RotateCcw, MapPin } from "lucide-react";
import {SwipeCard} from "@/components/SwipeCard";
import { Pet } from "@/types";
import Link from "next/link";
import { useUser } from "@/lib/supabase/auth-context";
import { toast } from "sonner";
import { recordSwipe } from "@/app/actions/pets";

interface SwipeClientProps {
  initialPets: Pet[];
}

export default function SwipeClient({ initialPets }: SwipeClientProps) {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [lastRemovedPet, setLastRemovedPet] = useState<Pet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useUser();

  const handleSwipe = async (direction: "left" | "right") => {
    const pet = pets[currentIndex];
    if (!pet) return;

    const petToRemove = pets.find((p) => p.id === pet.id);
    if (petToRemove) {
      setLastRemovedPet(petToRemove);
      setPets((prev) => prev.filter((p) => p.id !== pet.id));

      if (direction === "right") {
        try {
          // Call the server action to record the swipe
          await recordSwipe(String(petToRemove.id), "right");
          toast.success(`You liked ${petToRemove.name}!`);
        } catch (error) {
          console.error("Failed to like pet:", error);
        }
      }
    }

    setCurrentIndex(currentIndex + 1);
  };

  const handleUndo = () => {
    if (lastRemovedPet) {
      setPets((prev) => [...prev, lastRemovedPet]);
      setLastRemovedPet(null);
    }
  };

  if (currentIndex >= pets.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">No more pets to show</h2>
        <p className="text-gray-600 mb-6">You've seen all the available pets that match your preferences. Check back later for new furry friends!</p>
      </div>
    );
  }

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
                onSwipe={(dir) => handleSwipe(dir)}
              />
            ))
          ) : (
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <User size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">No more pets nearby!</h3>
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
          onPress={() => pets.length > 0 && handleSwipe("left")}
        >
          <X size={40} />
        </Button>
        
        <Button 
          isIconOnly 
          radius="full" 
          size="lg" 
          className="bg-white shadow-xl text-green-500 w-20 h-20 hover:scale-110 transition-transform border-4 border-transparent hover:border-green-100"
          onPress={() => pets.length > 0 && handleSwipe("right")}
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
