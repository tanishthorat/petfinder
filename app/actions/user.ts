"use server";

import { getUser } from "@/lib/supabase/server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function updateUserRole(role: string) {
  const authUser = await getUser();
  if (!authUser) throw new Error("Unauthorized");

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .update({ role: role as any })
    .eq("id", authUser.id);

  if (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }

  return data;
}

export async function setUserPreferences(preferences: {
  species: string[];
  age_min: number;
  age_max: number;
  size: string[];
  distance_km: number;
}) {
  const authUser = await getUser();
  if (!authUser) throw new Error("Unauthorized");

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert(
      {
        user_id: authUser.id,
        ...preferences,
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Error setting user preferences:", error);
    throw new Error("Failed to set user preferences");
  }

  return data;
}

export async function updateUserProfile(profile: {
  full_name: string;
  phone: string;
  bio: string;
}) {
  const authUser = await getUser();
  if (!authUser) throw new Error("Unauthorized");

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .update({
      full_name: profile.full_name,
      phone: profile.phone,
      bio: profile.bio,
    })
    .eq("id", authUser.id);

  if (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }

  return data;
}
