"use client";

import React, { useState } from "react";
import { Input, Button, Avatar, Card } from "@nextui-org/react";
import { Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm interested in adopting this pet.", sender: "me", time: "10:00 AM" },
    { id: 2, text: "Hello! That's great news. Do you have any questions?", sender: "shelter", time: "10:05 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white p-4 shadow-sm flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Link href="/matches">
            <Button isIconOnly variant="light" radius="full" className="md:hidden">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <Avatar src="https://via.placeholder.com/150" isBordered color="primary" />
          <div>
            <h2 className="font-bold">Happy Paws Shelter</h2>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button isIconOnly variant="light" radius="full"><Phone size={20} /></Button>
          <Button isIconOnly variant="light" radius="full"><Video size={20} /></Button>
          <Button isIconOnly variant="light" radius="full"><MoreVertical size={20} /></Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.sender === "me" 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-white text-gray-800 rounded-tl-none"
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-purple-200" : "text-gray-400"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input 
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            classNames={{
              inputWrapper: "bg-gray-100 hover:bg-gray-200 shadow-none",
            }}
          />
          <Button isIconOnly color="primary" className="shadow-lg shadow-primary/30" onPress={handleSend}>
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
