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
  
  return matches;
}
