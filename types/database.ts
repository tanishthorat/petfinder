// Database Types from Supabase Schema

export type UserRole = 'adopter' | 'owner' | 'shelter' | 'admin';
export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type PetGender = 'male' | 'female';
export type PetSize = 'small' | 'medium' | 'large' | 'extra_large';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type PetStatus = 'available' | 'pending' | 'adopted' | 'removed';
export type SwipeDirection = 'left' | 'right';
export type MatchStatus = 'matched' | 'contacted' | 'meeting_scheduled' | 'adopted' | 'rejected';

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_image_url?: string;
  phone?: string;
  address?: string;
  location_lat?: number;
  location_lng?: number;
  bio?: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: number; // in months
  gender: PetGender;
  size: PetSize;
  color?: string;
  description?: string;
  health_status?: string;
  vaccination_status?: boolean;
  is_neutered?: boolean;
  good_with_kids?: boolean;
  good_with_pets?: boolean;
  energy_level?: EnergyLevel;
  temperament?: string[];
  special_needs?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  status: PetStatus;
  images?: string[];
  created_at: string;
  updated_at: string;
  owner?: User; // relation
}

export interface Swipe {
  id: string;
  user_id: string;
  pet_id: string;
  direction: SwipeDirection;
  swiped_at: string;
  user?: User; // relation
  pet?: Pet; // relation
}

export interface Match {
  id: string;
  adopter_id: string;
  pet_id: string;
  owner_id: string;
  status: MatchStatus;
  matched_at: string;
  updated_at: string;
  adopter?: User; // relation
  pet?: Pet; // relation
  owner?: User; // relation
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  message: string;
  read: boolean;
  created_at: string;
  match?: Match; // relation
  sender?: User; // relation
}

export interface UserPreferences {
  id: string;
  user_id: string;
  species?: string[];
  age_min?: number;
  age_max?: number;
  size?: string[];
  gender?: string[];
  distance_km?: number;
  good_with_kids?: boolean;
  good_with_pets?: boolean;
  energy_level?: string[];
  updated_at: string;
  user?: User; // relation
}

// Request/Response Types
export interface CreatePetRequest {
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  gender: PetGender;
  size: PetSize;
  color?: string;
  description?: string;
  health_status?: string;
  vaccination_status?: boolean;
  is_neutered?: boolean;
  good_with_kids?: boolean;
  good_with_pets?: boolean;
  energy_level?: EnergyLevel;
  temperament?: string[];
  special_needs?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  images?: string[];
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  address?: string;
  location_lat?: number;
  location_lng?: number;
  bio?: string;
}

export interface SetPreferencesRequest {
  species?: string[];
  age_min?: number;
  age_max?: number;
  size?: string[];
  gender?: string[];
  distance_km?: number;
  good_with_kids?: boolean;
  good_with_pets?: boolean;
  energy_level?: string[];
}
