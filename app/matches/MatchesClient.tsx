"use client";

import React from "react";
import { Card, CardBody, Avatar, Badge } from "@nextui-org/react";
import { Pet } from "@/types";
import Link from "next/link";

interface MatchesClientProps {
  initialPets: Pet[];
}

export default function MatchesClient({ initialPets }: MatchesClientProps) {
  // In a real app, these would be filtered by "liked" status from DB
  const matches = initialPets.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-sm font-bold text-pink-500 uppercase tracking-wider mb-3">New Matches</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {matches.map((pet) => {
            const imageUrl = pet.primary_photo_cropped?.small || pet.photos[0]?.small || "https://via.placeholder.com/150";
            return (
              <Link key={pet.id} href={`/pet/${pet.id}`} className="flex-shrink-0">
                <div className="relative">
                  <Badge content="" color="success" shape="circle" placement="bottom-right" className="border-2 border-white">
                    <Avatar 
                      src={imageUrl} 
                      className="w-20 h-20 text-large border-2 border-pink-500" 
                      isBordered 
                      color="danger"
                    />
                  </Badge>
                </div>
                <p className="text-center text-xs font-semibold mt-1 truncate w-20">{pet.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Messages</h2>
        <div className="flex flex-col gap-2">
          {matches.map((pet, index) => {
            const imageUrl = pet.primary_photo_cropped?.small || pet.photos[0]?.small || "https://via.placeholder.com/150";
            return (
              <Link key={pet.id} href={`/pet/${pet.id}`}>
                <Card shadow="none" className="border-b rounded-none hover:bg-gray-50 transition-colors">
                  <CardBody className="flex flex-row items-center gap-4 p-3">
                    <Avatar src={imageUrl} size="lg" radius="full" />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-base">{pet.name}</h3>
                        <span className="text-xs text-gray-400">
                          {index === 0 ? "Now" : index === 1 ? "2h ago" : "Yesterday"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {index === 0 
                          ? "You matched! Say hello 👋" 
                          : "Can we schedule a visit for this weekend?"}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
