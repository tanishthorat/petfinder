import React from "react";
import { getAnimals } from "@/lib/petfinder";
import SwipeClient from "./SwipeClient";
import { mockPets } from "@/data/mock-pets";

import { getFeed } from "@/app/actions";

export default async function SwipePage() {
  const pets = await getFeed();

  return <SwipeClient initialPets={pets} />;
}
