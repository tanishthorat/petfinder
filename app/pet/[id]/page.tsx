import React from "react";
import { mockPets } from "@/data/mock-pets";
import { Pet } from "@/types";
import PetDetails from "@/components/PetDetails";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export default async function PetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let pet: Pet | undefined;

  // Try to fetch from Supabase database first
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();

    if (data && !error) {
      // Transform Supabase pet to match Pet type
      pet = {
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
    } else if (error) {
      console.error("Error fetching pet from database:", error);
    }
  } catch (error) {
    console.error("Error fetching pet:", error);
  }

  // Fallback to mock data if not found in database
  if (!pet) {
    pet = mockPets.find(p => p.id.toString() === id);
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
          <p className="text-gray-600 mb-4">The pet you're looking for doesn't exist or has been removed.</p>
          <Link href="/swipe" className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors">
            Go Back to Swipe
          </Link>
        </div>
      </div>
    );
  }

  return <PetDetails pet={pet} />;
}
