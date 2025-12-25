import { NextResponse } from 'next/server';
import { mockPets } from "@/data/mock-pets";

const PETFINDER_API_URL = 'https://api.petfinder.com/v2';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const clientId = process.env.PETFINDER_API_KEY;
  const clientSecret = process.env.PETFINDER_SECRET_KEY;

  if (!clientId || !clientSecret) {
    throw new Error('Petfinder API credentials are not set in environment variables.');
  }

  try {
    const response = await fetch(`${PETFINDER_API_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiration slightly before actual expiration to be safe (e.g., 60 seconds)
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return accessToken;
  } catch (error) {
    console.error('Error fetching Petfinder access token:', error);
    throw error;
  }
}

export async function fetchFromPetfinder(endpoint: string, params: Record<string, string> = {}) {
  const token = await getAccessToken();
  const queryString = new URLSearchParams(params).toString();
  const url = `${PETFINDER_API_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Petfinder API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Petfinder (${endpoint}):`, error);
    throw error;
  }
}



export async function getAnimals(params: Record<string, string> = {}) {
  try {
    return await fetchFromPetfinder('/animals', params);
  } catch (error) {
    console.log("ℹ️ Using mock data (Petfinder API not configured)");
    return { 
      animals: mockPets, 
      pagination: { 
        count: mockPets.length, 
        total_count: mockPets.length, 
        current_page: 1, 
        total_pages: 1 
      } 
    };
  }
}

export async function getAnimal(id: string) {
  return fetchFromPetfinder(`/animals/${id}`);
}

export async function getBreeds(type: string) {
  return fetchFromPetfinder(`/types/${type}/breeds`);
}

export async function getTypes() {
  return fetchFromPetfinder('/types');
}

// Enhanced search with all your app's filters
export interface SearchParams {
  type?: string; // 'dog', 'cat', 'rabbit', 'bird', etc.
  breed?: string[];
  size?: string[]; // 'small', 'medium', 'large', 'xlarge'
  gender?: string; // 'male', 'female'
  age?: string[]; // 'baby', 'young', 'adult', 'senior'
  color?: string;
  coat?: string; // 'short', 'medium', 'long'
  good_with_children?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  house_trained?: boolean;
  declawed?: boolean;
  special_needs?: boolean;
  location?: string; // ZIP code, city, or state
  distance?: number; // miles from location
  page?: number;
  limit?: number; // max 100
  sort?: 'recent' | 'distance' | '-recent' | '-distance';
}

export async function searchAnimals(searchParams: SearchParams = {}) {
  try {
    // Convert our SearchParams to Petfinder API format
    const params: Record<string, string> = {};
    
    if (searchParams.type) params.type = searchParams.type;
    if (searchParams.breed?.length) params.breed = searchParams.breed.join(',');
    if (searchParams.size?.length) params.size = searchParams.size.join(',');
    if (searchParams.gender) params.gender = searchParams.gender;
    if (searchParams.age?.length) params.age = searchParams.age.join(',');
    if (searchParams.color) params.color = searchParams.color;
    if (searchParams.coat) params.coat = searchParams.coat;
    if (searchParams.good_with_children !== undefined) params.good_with_children = String(searchParams.good_with_children);
    if (searchParams.good_with_dogs !== undefined) params.good_with_dogs = String(searchParams.good_with_dogs);
    if (searchParams.good_with_cats !== undefined) params.good_with_cats = String(searchParams.good_with_cats);
    if (searchParams.house_trained !== undefined) params.house_trained = String(searchParams.house_trained);
    if (searchParams.declawed !== undefined) params.declawed = String(searchParams.declawed);
    if (searchParams.special_needs !== undefined) params.special_needs = String(searchParams.special_needs);
    if (searchParams.location) params.location = searchParams.location;
    if (searchParams.distance) params.distance = String(searchParams.distance);
    if (searchParams.page) params.page = String(searchParams.page);
    if (searchParams.limit) params.limit = String(searchParams.limit);
    if (searchParams.sort) params.sort = searchParams.sort;
    
    return await fetchFromPetfinder('/animals', params);
  } catch (error) {
    console.log("ℹ️ Using mock data (Petfinder API not configured)");
    // Filter mock data based on search params
    let filteredPets = [...mockPets];
    
    if (searchParams.type) {
      filteredPets = filteredPets.filter(p => p.type.toLowerCase() === searchParams.type?.toLowerCase());
    }
    if (searchParams.gender) {
      filteredPets = filteredPets.filter(p => p.gender.toLowerCase() === searchParams.gender?.toLowerCase());
    }
    if (searchParams.age?.length) {
      filteredPets = filteredPets.filter(p => searchParams.age?.includes(p.age.toLowerCase()));
    }
    if (searchParams.size?.length) {
      filteredPets = filteredPets.filter(p => searchParams.size?.includes(p.size.toLowerCase()));
    }
    
    return {
      animals: filteredPets,
      pagination: {
        count: filteredPets.length,
        total_count: filteredPets.length,
        current_page: searchParams.page || 1,
        total_pages: 1
      }
    };
  }
}

// Get organizations (shelters)
export async function getOrganizations(params: Record<string, string> = {}) {
  try {
    return await fetchFromPetfinder('/organizations', params);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
}

// Get organization by ID
export async function getOrganization(id: string) {
  try {
    return await fetchFromPetfinder(`/organizations/${id}`);
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}
