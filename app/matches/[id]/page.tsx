import { createClient } from "@/utils/supabase/server";
import ChatClient from "./ChatClient";
import { getMessages, getMatchDetails } from "@/app/actions/messages";
import { auth } from "@clerk/nextjs/server";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return <div>Unauthorized</div>;

  const matchId = params.id;
  const messages = await getMessages(matchId);
  const matchDetails = await getMatchDetails(matchId);
  
  return (
    <ChatClient
      initialMessages={messages}
      matchDetails={matchDetails}
      matchId={matchId}
      clerkUserId={clerkUserId}
    />
  );
}
