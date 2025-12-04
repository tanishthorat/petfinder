import React from "react";
import { getAnimals } from "@/lib/petfinder";
import SearchClient from "./SearchClient";

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params: Record<string, string> = {};
  
  // Convert searchParams to simple object for API
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      params[key] = value;
    } else if (Array.isArray(value)) {
      params[key] = value.join(',');
    }
  });

  let pets = [];
  try {
    const data = await getAnimals({ limit: "20", ...params });
    pets = data.animals;
  } catch (error) {
    console.error("Failed to fetch pets:", error);
  }

  return <SearchClient pets={pets} />;
}
