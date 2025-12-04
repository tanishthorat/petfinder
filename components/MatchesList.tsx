"use client";

import React from "react";
import { Card, CardBody, Image, Button, Chip } from "@nextui-org/react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Match, Pet } from "@prisma/client"; // Or your types

// Define a type that includes the relation
type MatchWithPet = Match & { pet: Pet };

interface MatchesListProps {
  matches: MatchWithPet[];
}

export default function MatchesList({ matches }: MatchesListProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
        <p className="text-gray-500 mb-8">Pets you've liked and are waiting to meet you!</p>

        {matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h2 className="text-2xl font-bold mb-2">No matches yet</h2>
            <p className="text-gray-500 mb-6">Start swiping to find your perfect companion.</p>
            <Link href="/swipe">
              <Button color="primary" size="lg">Start Swiping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <Card key={match.id} className="w-full hover:shadow-md transition-shadow">
                <CardBody className="flex flex-row gap-4 p-4 items-center">
                  <Image
                    src={match.pet.images[0] || "https://via.placeholder.com/150"}
                    alt={match.pet.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{match.pet.name}</h3>
                        <p className="text-gray-500 text-sm">{match.pet.breed} • {(match.pet as any).ageString || match.pet.age} yrs</p>
                      </div>
                      <Chip size="sm" color="success" variant="flat">Matched</Chip>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/matches/${match.id}`}>
                        <Button color="primary" size="sm" startContent={<MessageCircle size={16} />}>
                          Chat
                        </Button>
                      </Link>
                      <Link href={`/pet/${match.pet.id}`}>
                        <Button variant="bordered" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
