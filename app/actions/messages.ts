"use server";

import { getUser } from "@/lib/supabase/server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function getMessages(matchId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:users!sender_id(*)
    `)
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
  
  // Ensure sender data is populated
  if (data) {
    const messagesWithSenders = await Promise.all(
      data.map(async (msg) => {
        if (!msg.sender && msg.sender_id) {
          const { data: sender } = await supabase
            .from("users")
            .select("*")
            .eq("id", msg.sender_id)
            .single();
          return { ...msg, sender };
        }
        return msg;
      })
    );
    return messagesWithSenders;
  }
  
  return data || [];
}

export async function getMatchDetails(matchId: string) {
  const supabase = await createSupabaseServerClient();
  
  // First get the match
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    console.error("Error fetching match:", matchError);
    throw new Error("Match not found");
  }

  console.log("Match found:", { 
    id: match.id, 
    adopter_id: match.adopter_id, 
    owner_id: match.owner_id, 
    pet_id: match.pet_id 
  });

  // Fetch adopter
  const { data: adopter, error: adopterError } = await supabase
    .from("users")
    .select("*")
    .eq("id", match.adopter_id)
    .single();

  if (adopterError) {
    console.error("Error fetching adopter:", adopterError);
  }

  // Fetch owner
  const { data: owner, error: ownerError } = await supabase
    .from("users")
    .select("*")
    .eq("id", match.owner_id)
    .single();

  if (ownerError) {
    console.error("Error fetching owner:", ownerError);
  }

  // Fetch pet
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("*")
    .eq("id", match.pet_id)
    .single();

  if (petError) {
    console.error("Error fetching pet:", petError);
  }

  console.log("Fetched data:", {
    hasAdopter: !!adopter,
    hasOwner: !!owner,
    hasPet: !!pet,
  });

  return {
    ...match,
    adopter,
    owner,
    pet,
  };
}

export async function sendMessage(matchId: string, message: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = await createSupabaseServerClient();

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
