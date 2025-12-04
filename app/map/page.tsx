"use client";

import React from "react";
import dynamic from "next/dynamic";
import { mockPets } from "@/data/mock-pets";

const MapView = dynamic(() => import("@/components/MapView"), { 
  ssr: false,
  loading: () => <div className="h-[calc(100vh-64px)] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <MapView pets={mockPets} />
    </div>
  );
}
