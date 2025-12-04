"use client";

import React from "react";
import { Button, Image, Chip, Divider } from "@nextui-org/react";
import { Heart, MapPin, Share2, ArrowLeft, Mail, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Pet } from "@/types";

interface PetDetailsProps {
  pet: Pet;
}

export default function PetDetails({ pet }: PetDetailsProps) {
  const images = pet.photos.map(p => p.full).length > 0 
    ? pet.photos.map(p => p.full) 
    : [pet.primary_photo_cropped?.full || "https://via.placeholder.com/600x600"];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b md:hidden">
        <Link href="/swipe">
          <Button isIconOnly variant="light" radius="full">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <span className="font-bold text-lg">{pet.name}</span>
        <Button isIconOnly variant="light" radius="full">
          <Share2 size={24} />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto md:py-8 md:px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square md:rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
              <Image
                src={images[0]}
                alt={pet.name}
                className="w-full h-full object-cover"
                radius="none"
              />
              <div className="absolute bottom-4 right-4 z-10">
                <Button isIconOnly radius="full" className="bg-white/90 text-red-500 shadow-lg">
                  <Heart size={24} />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 px-4 md:px-0">
              {images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <Image src={img} alt={`${pet.name} ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="px-6 md:px-0">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{pet.name}</h1>
                <Chip color="success" variant="flat" className="font-semibold">
                  {pet.status}
                </Chip>
              </div>
              <p className="text-xl text-gray-500 font-medium mb-4">{pet.breeds.primary} • {pet.age}</p>
              
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={20} className="text-primary" />
                <span>{pet.contact.address.city}, {pet.contact.address.state}</span>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <Chip variant="flat" size="lg" className="bg-purple-50 text-purple-700">{pet.gender}</Chip>
                <Chip variant="flat" size="lg" className="bg-blue-50 text-blue-700">{pet.size}</Chip>
                {pet.attributes.spayed_neutered && (
                  <Chip variant="flat" size="lg" className="bg-green-50 text-green-700">Spayed/Neutered</Chip>
                )}
                {pet.attributes.house_trained && (
                  <Chip variant="flat" size="lg" className="bg-orange-50 text-orange-700">House Trained</Chip>
                )}
              </div>
            </div>

            <Divider className="my-8" />

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About {pet.name}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {pet.description || "No description available for this pet yet. Contact the shelter to learn more!"}
              </p>
            </div>

            <Divider className="my-8" />

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">
                  🏠
                </div>
                <div>
                  <h3 className="text-xl font-bold">Shelter Information</h3>
                  <p className="text-gray-500">Verified Partner</p>
                </div>
                <ShieldCheck className="ml-auto text-blue-500" size={24} />
              </div>
              
              <div className="space-y-3 mb-6">
                {pet.contact.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={18} />
                    <span>{pet.contact.email}</span>
                  </div>
                )}
                {pet.contact.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} />
                    <span>{pet.contact.phone}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button color="primary" size="lg" className="font-bold shadow-lg shadow-primary/20">
                  Adopt Me
                </Button>
                <Button variant="bordered" size="lg" className="font-bold">
                  Contact Shelter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
