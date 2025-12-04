"use client";

import React from "react";
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { Pet } from "@/types";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const imageUrl = pet.primary_photo_cropped?.medium || pet.photos[0]?.medium || "https://via.placeholder.com/300x300?text=No+Image";
  const location = `${pet.contact.address.city}, ${pet.contact.address.state}`;

  return (
    <Link href={`/pet/${pet.id}`}>
      <Card shadow="sm" isPressable className="w-full h-full hover:shadow-md transition-shadow">
        <CardBody className="overflow-visible p-0">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={pet.name}
            className="w-full object-cover h-[250px]"
            src={imageUrl}
          />
        </CardBody>
        <CardFooter className="text-small justify-between flex-col items-start gap-1">
          <div className="flex justify-between w-full">
            <b className="text-lg">{pet.name}</b>
            <span className="text-default-500">{pet.age}</span>
          </div>
          <p className="text-default-500">{pet.breeds.primary}</p>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin size={12} />
            <span>{location}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
