import { createClient } from "@/utils/supabase/server";
import ChatClient from "./ChatClient";
import { getMessages, getMatchDetails } from "@/app/actions/messages";
import { getUser } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const { id: matchId } = await params;
  
  try {
    const messages = await getMessages(matchId);
    const matchDetails = await getMatchDetails(matchId);
    
    // Debug logging
    console.log("Match Details:", JSON.stringify(matchDetails, null, 2));
    console.log("Has adopter:", !!matchDetails?.adopter);
    console.log("Has owner:", !!matchDetails?.owner);
    console.log("Has pet:", !!matchDetails?.pet);
    
    // Validate data
    if (!matchDetails) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-500 font-semibold mb-2">Match not found</p>
            <p className="text-gray-500">This match may have been deleted</p>
          </div>
        </div>
      );
    }
    
    return (
      <ChatClient
        initialMessages={messages}
        matchDetails={matchDetails}
        matchId={matchId}
        userId={user.id}
      />
    );
  } catch (error) {
    console.error("Error loading chat:", error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">Error loading chat</p>
          <p className="text-gray-500">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }
}
