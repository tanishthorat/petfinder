"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Pet } from "@/types";
import { Button, Card, Image } from "@nextui-org/react";
import Link from "next/link";

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  pets: Pet[];
}

export default function MapView({ pets }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-full w-full bg-gray-100 animate-pulse" />;

  // Default center (New York)
  const center: [number, number] = [40.7128, -74.0060];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pets.map((pet) => (
        // Mocking coordinates since they aren't in the type yet
        // In a real app, we'd geocode the address
        <Marker 
          key={pet.id} 
          position={[
            40.7128 + (Math.random() - 0.5) * 0.1, 
            -74.0060 + (Math.random() - 0.5) * 0.1
          ]} 
          icon={icon}
        >
          <Popup>
            <Card className="w-48 p-0 shadow-none border-none">
              <Image 
                src={pet.primary_photo_cropped?.small || "https://via.placeholder.com/150"} 
                className="w-full h-32 object-cover rounded-b-none"
              />
              <div className="p-3">
                <h3 className="font-bold">{pet.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{pet.breeds.primary}</p>
                <Link href={`/pet/${pet.id}`}>
                  <Button size="sm" color="primary" className="w-full">View</Button>
                </Link>
              </div>
            </Card>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
