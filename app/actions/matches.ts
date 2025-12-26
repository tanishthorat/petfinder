"use server";

import { getUser } from "@/lib/supabase/server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function getMatches() {
  const authUser = await getUser();
  if (!authUser) throw new Error("Unauthorized");

  const supabase = await createSupabaseServerClient();

  const { data: matches, error } = await supabase
    .from("matches")
    .select("*, pet:pets(*)")
    .or(`adopter_id.eq.${authUser.id},owner_id.eq.${authUser.id}`)
    .order("matched_at", { ascending: false });

  if (error) {
    console.error("Error fetching matches:", error);
    throw new Error("Failed to fetch matches");
  }
  
  return matches || [];
}

export async function createMatchFromLike(petId: string, adopterId: string) {
  const authUser = await getUser();
  if (!authUser) throw new Error("Unauthorized");

  const supabase = await createSupabaseServerClient();

  // Get pet owner
  const { data: pet } = await supabase
    .from("pets")
    .select("owner_id")
    .eq("id", petId)
    .single();

  if (!pet || pet.owner_id !== authUser.id) {
    throw new Error("You can only create matches for your own pets");
  }

  // Check if match already exists
  const { data: existingMatch } = await supabase
    .from("matches")
    .select("id")
    .eq("pet_id", petId)
    .eq("adopter_id", adopterId)
    .eq("owner_id", authUser.id)
    .single();

  if (existingMatch) {
    return existingMatch;
  }

  // Create new match
  const { data: match, error } = await supabase
    .from("matches")
    .insert([
      {
        pet_id: petId,
        adopter_id: adopterId,
        owner_id: authUser.id,
        status: "matched",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating match:", error);
    throw new Error("Failed to create match");
  }

  return match;
}
