import React from "react";
import { getAnimals } from "@/lib/petfinder";
import { createClient } from "@/utils/supabase/server";
import SwipeClient from "./SwipeClient";
import { getPetsForSwiping } from "@/app/actions/pets";

export default async function SwipePage() {
  const pets = await getPetsForSwiping();

  return <SwipeClient pets={pets} />;
}
