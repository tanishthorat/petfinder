import React from "react";
import SwipeClient from "./SwipeClient";
import { getPetsForSwiping } from "@/app/actions/pets";
import { Pet } from "@/types";

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

export default async function SwipePage() {
  const rawPets = await getPetsForSwiping();
  const pets = rawPets.map(transformSupabasePet);

  return <SwipeClient initialPets={pets} />;
}
