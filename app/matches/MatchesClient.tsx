"use client";

import React from "react";
import { Card, CardBody, Avatar, Button } from "@nextui-org/react";
import Link from "next/link";
import { Match } from "@/types";

interface MatchesClientProps {
  initialMatches: Match[];
}

export default function MatchesClient({ initialMatches = [] }: MatchesClientProps) {
  const matches = initialMatches;

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">No Matches Yet</h2>
        <p className="text-gray-600 mb-6">Keep swiping to find your perfect pet match!</p>
        <Link href="/swipe">
          <Button color="primary">Start Swiping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Matches</h1>
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} shadow="sm" isPressable>
              <Link href={`/matches/${match.id}`}>
                <CardBody className="flex flex-row items-center space-x-4 p-4">
                  <Avatar src={match.pet.images[0]} className="w-16 h-16" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{match.pet.name}</h3>
                    <p className="text-gray-600">You matched on {new Date(match.matched_at).toLocaleDateString()}</p>
                  </div>
                  <Button color="primary" variant="ghost" as="div">
                    Message
                  </Button>
                </CardBody>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
