"use client";

import React from "react";
import { Card, CardBody, CardFooter, Image, Button, Chip } from "@nextui-org/react";
import { Pet } from "@/types";
import Link from "next/link";
import { MapPin, Heart, X } from "lucide-react";

interface PetCardProps {
  pet: Pet;
  swipeDirection?: 'left' | 'right';
}

export default function PetCard({ pet, swipeDirection }: PetCardProps) {
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
          {swipeDirection && (
            <Chip
              className="absolute top-2 right-2 z-10"
              color={swipeDirection === 'right' ? 'success' : 'danger'}
              variant="shadow"
              startContent={swipeDirection === 'right' ? <Heart size={18}/> : <X size={18}/>}
            >
              {swipeDirection === 'right' ? 'Liked' : 'Passed'}
            </Chip>
          )}
        </CardBody>
        <CardFooter className="text-small justify-between flex-col items-start gap-1 absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
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
