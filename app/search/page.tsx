import React from "react";
import { searchAnimals, SearchParams } from "@/lib/petfinder";
import SearchClient from "./SearchClient";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  
  // Build typed search parameters
  const params: SearchParams = {
    limit: 20,
    page: 1,
  };
  
  // Type filter
  if (resolvedSearchParams.type && typeof resolvedSearchParams.type === 'string') {
    params.type = resolvedSearchParams.type;
  }
  
  // Age filter (can be multiple)
  if (resolvedSearchParams.age) {
    params.age = Array.isArray(resolvedSearchParams.age) 
      ? resolvedSearchParams.age 
      : [resolvedSearchParams.age];
  }
  
  // Gender filter
  if (resolvedSearchParams.gender && typeof resolvedSearchParams.gender === 'string') {
    params.gender = resolvedSearchParams.gender;
  }
  
  // Size filter (can be multiple)
  if (resolvedSearchParams.size) {
    params.size = Array.isArray(resolvedSearchParams.size) 
      ? resolvedSearchParams.size 
      : [resolvedSearchParams.size];
  }
  
  // Location filters
  if (resolvedSearchParams.location && typeof resolvedSearchParams.location === 'string') {
    params.location = resolvedSearchParams.location;
  }
  
  if (resolvedSearchParams.distance && typeof resolvedSearchParams.distance === 'string') {
    params.distance = parseInt(resolvedSearchParams.distance);
  }
  
  // Environment filters
  if (resolvedSearchParams.good_with_children === 'true') {
    params.good_with_children = true;
  }
  if (resolvedSearchParams.good_with_dogs === 'true') {
    params.good_with_dogs = true;
  }
  if (resolvedSearchParams.good_with_cats === 'true') {
    params.good_with_cats = true;
  }
  
  // Pagination
  if (resolvedSearchParams.page && typeof resolvedSearchParams.page === 'string') {
    params.page = parseInt(resolvedSearchParams.page);
  }

  let pets = [];
  let pagination = null;
  
  try {
    const data = await searchAnimals(params);
    pets = data.animals || [];
    pagination = data.pagination;
  } catch (error) {
    console.error("Failed to fetch pets:", error);
  }

  return <SearchClient pets={pets} pagination={pagination} />;
}
