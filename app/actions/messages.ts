"use server";

import { getUser } from "@/lib/supabase/server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function getMessages(matchId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:users(*)")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
  return data;
}

export async function getMatchDetails(matchId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("matches")
    .select("*, pet:pets(*), adopter:users!matches_adopter_id_fkey(*), owner:users!matches_owner_id_fkey(*)")
    .eq("id", matchId)
    .single();

  if (error) {
    console.error("Error fetching match details:", error);
    throw new Error("Failed to fetch match details");
  }
  return data;
}

export async function sendMessage(matchId: string, message: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createClient();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    throw new Error("Could not find user");
  }

  const { data, error } = await supabase.from("messages").insert([
    {
      match_id: matchId,
      sender_id: user.id,
      message,
    },
  ]);

  if (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
  return data;
}
