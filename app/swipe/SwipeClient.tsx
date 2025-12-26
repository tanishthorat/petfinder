"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@nextui-org/react";
import { X, Heart, RotateCcw, MapPin, User } from "lucide-react";
import {SwipeCard} from "@/components/SwipeCard";
import { Pet } from "@/types";
import Link from "next/link";
import { useUser } from "@/lib/supabase/auth-context";
import { toast } from "sonner";
import { recordSwipe } from "@/app/actions/pets";

interface SwipeClientProps {
  initialPets: Pet[];
}

// Configuration
const PRELOAD_COUNT = 5; // Initial pets to load
const FETCH_THRESHOLD = 2; // Fetch more when this many pets left
const BATCH_SIZE = 5; // How many pets to fetch each time

// Transform Supabase pet to Pet type
function transformSupabasePet(data: any): Pet {
  return {
    id: data.id,
    name: data.name,
    type: data.species || "dog",
    species: data.species || "dog",
    age: data.age_string || data.age?.toString() || "Unknown",
    gender: data.gender || "unknown",
    size: data.size || "medium",
    breeds: {
      primary: data.breed || "Unknown",
      secondary: null,
      mixed: false,
      unknown: !data.breed,
    },
    description: data.description || "",
    photos: data.images?.map((url: string) => ({ 
      full: url, 
      medium: url, 
      small: url,
      large: url 
    })) || [],
    primary_photo_cropped: data.images?.[0] ? {
      full: data.images[0],
      medium: data.images[0],
      small: data.images[0],
      large: data.images[0],
    } : undefined,
    contact: {
      address: {
        city: data.location?.split(", ")[0] || "",
        state: data.location?.split(", ")[1] || "",
        address1: null,
        address2: null,
        postcode: null,
        country: "US",
      },
      email: null,
      phone: null,
    },
    attributes: {
      spayed_neutered: data.is_neutered || false,
      house_trained: data.good_with_kids || false,
      declawed: null,
      special_needs: false,
      shots_current: data.vaccination_status || false,
    },
    environment: {
      children: data.good_with_kids || null,
      dogs: data.good_with_pets || null,
      cats: null,
    },
    status: data.status || "available",
    organization_id: data.organization || null,
    url: null,
    colors: null,
    coat: null,
    tags: [],
    videos: [],
    published_at: data.created_at,
    _links: null,
  } as Pet;
}

export default function SwipeClient({ initialPets = [] }: SwipeClientProps) {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [lastRemovedPet, setLastRemovedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false); // Prevent duplicate fetches
  const { user } = useUser();

  const currentPet = pets[0]; // Always show the first pet in the array

  // Fetch more pets when threshold is reached
  const fetchMorePets = async () => {
    if (isFetchingRef.current || !hasMore || isLoading) {
      console.log("⏭️ Skipping fetch:", { isFetching: isFetchingRef.current, hasMore, isLoading });
      return;
    }
    
    isFetchingRef.current = true;
    setIsLoading(true);
    
    try {
      console.log(`🔄 Fetching more pets... (${pets.length} currently in queue)`);
      
      // Use API endpoint instead of server action
      const response = await fetch('/api/pets/swipe');
      if (!response.ok) throw new Error('Failed to fetch pets');
      
      const rawPets = await response.json();
      
      if (rawPets.length === 0) {
        console.log("✅ No more pets available");
        setHasMore(false);
      } else {
        // Transform raw Supabase pets to Pet type
        const transformedPets = rawPets.map(transformSupabasePet);
        console.log(`✅ Loaded ${transformedPets.length} more pets (queue now: ${pets.length + transformedPets.length})`);
        setPets((prev) => [...prev, ...transformedPets]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch more pets:", error);
      toast.error("Failed to load more pets");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Check if we need to fetch more pets
  useEffect(() => {
    if (pets.length <= FETCH_THRESHOLD && hasMore && !isLoading && !isFetchingRef.current) {
      console.log(`⚡ Threshold reached (${pets.length} pets left), fetching more...`);
      fetchMorePets();
    }
  }, [pets.length]); // Only depend on pets.length, other checks are in the condition

  const handleSwipe = async (direction: "left" | "right") => {
    const pet = currentPet;
    if (!pet) return;

    console.log(`👆 Swiped ${direction} on ${pet.name} (${pets.length - 1} pets will remain)`);

    // Record the swipe in the database
    try {
      await recordSwipe(String(pet.id), direction);
      
      if (direction === "right") {
        toast.success(`You liked ${pet.name}!`);
      }
    } catch (error) {
      console.error("Failed to record swipe:", error);
    }

    // Save for undo and remove from stack
    setLastRemovedPet(pet);
    setPets((prev) => {
      const newQueue = prev.slice(1);
      console.log(`📊 Queue updated: ${newQueue.length} pets remaining`);
      return newQueue;
    });
  };

  const handleUndo = () => {
    if (lastRemovedPet) {
      setPets((prev) => [lastRemovedPet, ...prev]); // Add back to beginning
      setLastRemovedPet(null);
    }
  };

  if (pets.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">No more pets to show</h2>
        <p className="text-gray-600 mb-6">
          {hasMore 
            ? "Loading more pets..." 
            : "You've seen all the available pets that match your preferences. Check back later for new furry friends!"}
        </p>
        {!hasMore && (
          <Button 
            color="primary" 
            size="lg"
            className="font-semibold shadow-lg shadow-primary/30"
            onPress={() => window.location.reload()}
          >
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 overflow-hidden relative">
      {/* Loading Indicator */}
      {isLoading && pets.length <= 2 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white px-4 py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700">Loading more pets...</span>
          </div>
        </div>
      )}

      {/* Pet Counter */}
      <div className="absolute top-4 right-4 z-40 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
        <span className="text-sm font-semibold text-gray-700">
          {pets.length} pet{pets.length !== 1 ? 's' : ''} remaining
        </span>
      </div>

      {/* Card Stack */}
      <main className="flex-1 flex items-center justify-center relative w-full max-w-md mx-auto my-4">
        <div className="relative w-full h-[600px] flex items-center justify-center">
          {/* Show next 3 pets in stack for preview effect */}
          {pets.slice(0, 3).map((pet, index) => (
            <SwipeCard
              key={pet.id}
              pet={pet}
              active={index === 0} // Only first card is active
              onSwipe={(dir) => handleSwipe(dir)}
            />
          ))}
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
          onPress={() => handleSwipe("left")}
          isDisabled={pets.length === 0}
        >
          <X size={40} />
        </Button>
        
        <Button 
          isIconOnly 
          radius="full" 
          size="lg" 
          className="bg-white shadow-xl text-green-500 w-20 h-20 hover:scale-110 transition-transform border-4 border-transparent hover:border-green-100"
          onPress={() => handleSwipe("right")}
          isDisabled={pets.length === 0}
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
