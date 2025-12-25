"use client";

import { useEffect, useState, useRef } from "react";
import { Input, Button, Avatar, Card, CardBody, CardHeader } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "@/app/actions/messages";

export default function ChatClient({ initialMessages, matchDetails, matchId, clerkUserId }: { initialMessages: any[], matchDetails: any, matchId: string, clerkUserId: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const supabase = createClient();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, supabase]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    await sendMessage(matchId, newMessage);
    setNewMessage("");
  };

  const otherUser = matchDetails.adopter.clerk_user_id === clerkUserId 
    ? matchDetails.owner 
    : matchDetails.adopter;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <CardHeader className="flex items-center space-x-4 p-4 border-b">
        <Avatar src={otherUser.profile_image_url} />
        <div>
          <h2 className="font-semibold">{otherUser.full_name}</h2>
          <p className="text-sm text-gray-500">Matched with {matchDetails.pet.name}</p>
        </div>
      </CardHeader>
      
      <CardBody className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender.clerk_user_id === clerkUserId ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender.clerk_user_id !== clerkUserId && <Avatar src={msg.sender.profile_image_url} className="w-8 h-8" />}
            <div
              className={`rounded-lg px-4 py-2 max-w-sm ${
                msg.sender.clerk_user_id === clerkUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-content1"
              }`}
            >
              {msg.message}
            </div>
             {msg.sender.clerk_user_id === clerkUserId && <Avatar src={msg.sender.profile_image_url} className="w-8 h-8" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardBody>

      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            variant="bordered"
          />
          <Button type="submit" color="primary" isIconOnly>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/></svg>
          </Button>
        </form>
      </div>
    </div>
  );
}
