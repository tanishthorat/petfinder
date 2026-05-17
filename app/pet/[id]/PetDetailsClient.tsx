"use client";

import React from "react";
import { Button, Image, Chip, Divider } from "@nextui-org/react";
import Link from "next/link";
import { ArrowLeft, MapPin, Mail, Phone, Heart } from "lucide-react";

interface PetDetailsClientProps {
  pet: any;
}

export default function PetDetailsClient({ pet }: PetDetailsClientProps) {
  const imageUrl = pet.primary_photo_cropped?.full || pet.photos[0]?.full || "https://via.placeholder.com/600x600?text=No+Image";
  const location = `${pet.contact.address.city}, ${pet.contact.address.state}`;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Image */}
      <div className="relative h-[50vh] bg-gray-100">
        <Link href="/search" className="absolute top-4 left-4 z-10">
          <Button isIconOnly variant="flat" className="bg-white/50 backdrop-blur-md">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <Image
          removeWrapper
          src={imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto -mt-10 relative z-10 bg-white rounded-t-3xl p-6 md:p-10 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{pet.name}</h1>
            <p className="text-xl text-gray-500">{pet.breeds.primary} • {pet.age}</p>
          </div>
          <Button color="secondary" variant="shadow" endContent={<Heart size={20} fill="currentColor" />}>
            Favorite
          </Button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <Chip variant="flat" color="primary">{pet.gender}</Chip>
          <Chip variant="flat" color="secondary">{pet.size}</Chip>
          <Chip variant="flat" color="success">{pet.status}</Chip>
          {pet.attributes.spayed_neutered && <Chip variant="flat" color="warning">Spayed/Neutered</Chip>}
          {pet.attributes.house_trained && <Chip variant="flat" color="warning">House Trained</Chip>}
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-8">
          <MapPin size={20} />
          <span>{location}</span>
        </div>

        <Divider className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About {pet.name}</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {pet.description || "No description available."}
          </p>
        </section>

        <Divider className="my-8" />

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
          <div className="flex flex-col gap-4">
            {pet.contact.email && (
              <div className="flex items-center gap-3">
                <Mail className="text-purple-600" />
                <a href={`mailto:${pet.contact.email}`} className="text-purple-600 hover:underline">
                  {pet.contact.email}
                </a>
              </div>
            )}
            {pet.contact.phone && (
              <div className="flex items-center gap-3">
                <Phone className="text-purple-600" />
                <a href={`tel:${pet.contact.phone}`} className="text-purple-600 hover:underline">
                  {pet.contact.phone}
                </a>
              </div>
            )}
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:static md:border-none md:p-0 md:mt-10">
          <Button size="lg" color="primary" className="w-full font-bold text-lg">
            Adopt {pet.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
