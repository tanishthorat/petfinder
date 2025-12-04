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
    console.warn("Falling back to mock data due to API error:", error);
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
