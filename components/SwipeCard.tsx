"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Card, Image, Button } from "@nextui-org/react";
import { MapPin, Info } from "lucide-react";
import { Pet } from "@/types";
import Link from "next/link";

interface SwipeCardProps {
  pet: Pet;
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ pet, onSwipe, active }) => {
  const [exitX, setExitX] = useState<number | null>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Color overlays for swipe feedback
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitX(200);
      onSwipe("right");
    } else if (info.offset.x < -100) {
      setExitX(-200);
      onSwipe("left");
    }
  };

  if (!active) return null;

  // Get the best available image
  const imageUrl = pet.primary_photo_cropped?.full || (pet.photos ?? [])[0]?.full || "https://via.placeholder.com/400x600?text=No+Image";
  const location = pet.contact?.address?.city && pet.contact?.address?.state 
    ? `${pet.contact.address.city}, ${pet.contact.address.state}`
    : "Location Unknown";

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        position: "absolute",
        top: 0,
        cursor: "grab",
        zIndex: 10,
      }}
      whileTap={{ cursor: "grabbing" }}
      drag={true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: exitX ? exitX * 5 : 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm h-[600px]"
    >
      <Card className="w-full h-full border-none shadow-2xl bg-black overflow-hidden relative rounded-3xl">
        {/* Swipe Feedback Overlays */}
        <motion.div 
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-8 z-20 border-4 border-green-500 rounded-lg px-4 py-2 transform -rotate-12 bg-black/20 backdrop-blur-sm"
        >
          <span className="text-green-500 font-bold text-4xl uppercase tracking-widest text-shadow-sm">Like</span>
        </motion.div>
        
        <motion.div 
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-8 z-20 border-4 border-red-500 rounded-lg px-4 py-2 transform rotate-12 bg-black/20 backdrop-blur-sm"
        >
          <span className="text-red-500 font-bold text-4xl uppercase tracking-widest text-shadow-sm">Nope</span>
        </motion.div>

        <Image
          removeWrapper
          alt={pet.name}
          className="z-0 w-full h-full object-cover pointer-events-none"
          src={imageUrl}
        />
        
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent p-8 pt-32 text-white">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-4xl font-bold flex items-baseline gap-3 mb-1">
                {pet.name} <span className="text-2xl font-normal opacity-90">{pet.age}</span>
              </h2>
              <p className="text-xl font-medium opacity-90 text-purple-200">{pet.breeds?.primary || 'Unknown Breed'}</p>
            </div>
            <Link href={`/pet/${pet.id}`}>
              <Button isIconOnly variant="flat" className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30" radius="full" size="lg">
                <Info size={28} />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 opacity-80 mb-6">
            <MapPin size={18} className="text-pink-400" />
            <span className="text-base font-medium">{location}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium backdrop-blur-md">
              {pet.gender}
            </div>
            <div className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium backdrop-blur-md">
              {pet.size}
            </div>
            {pet.attributes?.spayed_neutered && (
              <div className="px-4 py-1.5 bg-green-500/20 border border-green-500/30 text-green-200 rounded-full text-sm font-medium backdrop-blur-md">
                Fixed
              </div>
            )}
            {pet.attributes?.house_trained && (
              <div className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-200 rounded-full text-sm font-medium backdrop-blur-md">
                House Trained
              </div>
            )}
            {pet.attributes?.shots_current && (
              <div className="px-4 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-200 rounded-full text-sm font-medium backdrop-blur-md">
                Shots Current
              </div>
            )}
            {pet.attributes?.special_needs && (
              <div className="px-4 py-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 rounded-full text-sm font-medium backdrop-blur-md">
                Special Needs
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {pet.environment?.children && (
              <div className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium backdrop-blur-md">
                Good with Kids
              </div>
            )}
            {pet.environment?.dogs && (
              <div className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium backdrop-blur-md">
                Good with Dogs
              </div>
            )}
            {pet.environment?.cats && (
              <div className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium backdrop-blur-md">
                Good with Cats
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
