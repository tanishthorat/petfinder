import React from "react";
import { searchPets } from "@/app/actions/pets";
import SearchClient from "./SearchClient";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;

  const pets = await searchPets(resolvedSearchParams);

  return <SearchClient pets={pets} />;
}
