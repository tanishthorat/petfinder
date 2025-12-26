"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Input, Button, Avatar, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "@/app/actions/messages";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function ChatClient({ initialMessages, matchDetails, matchId, userId }: { initialMessages: any[], matchDetails: any, matchId: string, userId: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const supabase = createClient();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentUserId = userId;

  // Setup real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${matchId}`, {
        config: {
          presence: {
            key: currentUserId,
          },
        },
      })
      // Listen for new messages
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "messages", 
          filter: `match_id=eq.${matchId}` 
        },
        async (payload) => {
          console.log("📩 New message received:", payload.new);
          
          // Fetch sender data for the new message
          const { data: sender } = await supabase
            .from("users")
            .select("*")
            .eq("id", payload.new.sender_id)
            .single();
          
          const messageWithSender = {
            ...payload.new,
            sender,
          };
          
          setMessages((prevMessages) => [...prevMessages, messageWithSender]);
        }
      )
      // Listen for message updates (read receipts)
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "messages", 
          filter: `match_id=eq.${matchId}` 
        },
        (payload) => {
          console.log("✅ Message updated:", payload.new);
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            )
          );
        }
      )
      // Track online presence
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        console.log("👥 Presence state:", state);
        
        // Check if other user is online
        const otherUserId = matchDetails.adopter?.id === currentUserId 
          ? matchDetails.owner?.id 
          : matchDetails.adopter?.id;
        
        const otherUserPresent = Object.keys(state).some(
          (key) => key === otherUserId
        );
        
        setOtherUserOnline(otherUserPresent);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("🟢 User joined:", key);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("🔴 User left:", key);
      })
      // Listen for typing indicators
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.userId !== currentUserId) {
          console.log("⌨️ User typing:", payload.userId);
          setOtherUserTyping(true);
          
          // Clear typing indicator after 3 seconds
          setTimeout(() => {
            setOtherUserTyping(false);
          }, 3000);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Connected to real-time chat");
          
          // Track presence
          await channel.track({
            user_id: currentUserId,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      console.log("🔌 Disconnecting from chat");
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [matchId, currentUserId, matchDetails]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      
      // Broadcast typing event
      channelRef.current?.send({
        type: "broadcast",
        event: "typing",
        payload: { userId: currentUserId },
      });
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  }, [isTyping, currentUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Clear typing indicator
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    await sendMessage(matchId, newMessage);
    setNewMessage("");
  };
  
  // Mark messages as read when they come into view
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const unreadMessages = messages.filter(
        (msg) => msg.sender_id !== currentUserId && !msg.read
      );
      
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg) => msg.id);
        
        // Update read status
        await supabase
          .from("messages")
          .update({ read: true })
          .in("id", messageIds);
      }
    };
    
    markMessagesAsRead();
  }, [messages, currentUserId]);

  // Debug logging
  useEffect(() => {
    console.log("🔍 ChatClient Debug:", {
      hasMatchDetails: !!matchDetails,
      hasAdopter: !!matchDetails?.adopter,
      hasOwner: !!matchDetails?.owner,
      hasPet: !!matchDetails?.pet,
      adopterId: matchDetails?.adopter?.id,
      ownerId: matchDetails?.owner?.id,
      currentUserId,
    });
  }, [matchDetails, currentUserId]);

  const otherUser = matchDetails?.adopter?.id === currentUserId 
    ? matchDetails?.owner 
    : matchDetails?.adopter;

  // Fallback if user data is missing
  if (!matchDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 font-semibold">Match details not found</p>
        <p className="text-gray-500 text-sm">This match may not exist</p>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 font-semibold">User data missing</p>
        <p className="text-gray-500 text-sm">
          Missing: {!matchDetails.adopter ? "adopter" : ""} {!matchDetails.owner ? "owner" : ""}
        </p>
        <details className="text-xs text-gray-400">
          <summary>Debug Info</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded">
            {JSON.stringify({ 
              adopterId: matchDetails.adopter_id,
              ownerId: matchDetails.owner_id,
              hasAdopter: !!matchDetails.adopter,
              hasOwner: !!matchDetails.owner
            }, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  if (!matchDetails.pet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 font-semibold">Pet data missing</p>
        <p className="text-gray-500 text-sm">Pet ID: {matchDetails.pet_id || "unknown"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Online Status */}
      <CardHeader className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar src={otherUser.profile_image_url || undefined} />
            {/* Online Status Indicator */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                otherUserOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div>
            <h2 className="font-semibold">{otherUser.full_name || "Unknown User"}</h2>
            <p className="text-xs text-gray-500">
              {otherUserOnline ? (
                <span className="text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online
                </span>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>
        <Chip size="sm" variant="flat" color="secondary">
          {matchDetails.pet.name}
        </Chip>
      </CardHeader>
      
      {/* Messages Area */}
      <CardBody className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender?.id === currentUserId || msg.sender_id === currentUserId;
          const showAvatar = index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;
          
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isCurrentUser && showAvatar && (
                <Avatar src={msg.sender?.profile_image_url || undefined} className="w-8 h-8" />
              )}
              {!isCurrentUser && !showAvatar && <div className="w-8" />}
              
              <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2 max-w-sm break-words ${
                    isCurrentUser
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-content2 text-content2-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                
                {/* Timestamp and Read Receipt */}
                <div className="flex items-center gap-1 mt-1 px-2">
                  <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {isCurrentUser && msg.read && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className="text-blue-500"
                    >
                      <path d="M20 6L9 17l-5-5"/>
                      <path d="m9 17 5-5"/>
                    </svg>
                  )}
                </div>
              </div>
              
              {isCurrentUser && showAvatar && (
                <Avatar src={msg.sender?.profile_image_url || undefined} className="w-8 h-8" />
              )}
              {isCurrentUser && !showAvatar && <div className="w-8" />}
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex items-center gap-2 pl-2">
            <div className="flex gap-1 bg-content2 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-xs text-gray-500">typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardBody>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            fullWidth
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            variant="bordered"
            classNames={{
              input: "text-sm",
              inputWrapper: "bg-gray-50 border-gray-200 hover:bg-gray-100",
            }}
          />
          <Button 
            type="submit" 
            color="primary" 
            isIconOnly
            isDisabled={!newMessage.trim()}
            className="shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
}
