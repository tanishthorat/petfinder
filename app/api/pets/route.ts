import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/lib/supabase/server-client";
import { NextResponse, NextRequest } from "next/server";
import { getPetsForSwiping } from "@/app/actions/pets";
import { searchAnimals, SearchParams } from '@/lib/petfinder';
import { getPetsFromSupabase } from '@/lib/supabase';

// Use Supabase if configured. Falls back to Petfinder/mock behavior in lib/petfinder.

export async function GET() {
  try {
    const pets = await getPetsForSwiping();
    return NextResponse.json(pets);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pets")
    .insert([{ owner_id: user.id, ...body }]);

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Build search parameters from query string
    const params: SearchParams = {};
    
    // Type filter
    const type = searchParams.get('type');
    if (type) params.type = type;
    
    // Breed filter (can have multiple values)
    const breeds = searchParams.getAll('breed');
    if (breeds.length > 0) params.breed = breeds;
    
    // Size filter (can have multiple values)
    const sizes = searchParams.getAll('size');
    if (sizes.length > 0) params.size = sizes;
    
    // Gender filter
    const gender = searchParams.get('gender');
    if (gender) params.gender = gender;
    
    // Age filter (can have multiple values)
    const ages = searchParams.getAll('age');
    if (ages.length > 0) params.age = ages;
    
    // Color filter
    const color = searchParams.get('color');
    if (color) params.color = color;
    
    // Coat filter
    const coat = searchParams.get('coat');
    if (coat) params.coat = coat;
    
    // Environment filters
    const goodWithChildren = searchParams.get('good_with_children');
    if (goodWithChildren) params.good_with_children = goodWithChildren === 'true';
    
    const goodWithDogs = searchParams.get('good_with_dogs');
    if (goodWithDogs) params.good_with_dogs = goodWithDogs === 'true';
    
    const goodWithCats = searchParams.get('good_with_cats');
    if (goodWithCats) params.good_with_cats = goodWithCats === 'true';
    
    // Attribute filters
    const houseTrained = searchParams.get('house_trained');
    if (houseTrained) params.house_trained = houseTrained === 'true';
    
    const specialNeeds = searchParams.get('special_needs');
    if (specialNeeds) params.special_needs = specialNeeds === 'true';
    
    // Location filters
    const location = searchParams.get('location');
    if (location) params.location = location;
    
    const distance = searchParams.get('distance');
    if (distance) params.distance = parseInt(distance);
    
    // Pagination
    const page = searchParams.get('page');
    if (page) params.page = parseInt(page);
    
    const limit = searchParams.get('limit');
    if (limit) params.limit = parseInt(limit);
    
    // Sorting
    const sort = searchParams.get('sort');
    if (sort) params.sort = sort as 'recent' | 'distance' | '-recent' | '-distance';
    
    // If Supabase is configured, attempt to fetch from it first
    let data;
    try {
      data = await getPetsFromSupabase({
        type: params.type,
        gender: params.gender,
        age: params.age as any,
        size: params.size as any,
        limit: params.limit ? parseInt(params.limit) : undefined,
        page: params.page ? parseInt(params.page) : undefined,
      });
    } catch (err) {
      console.error('Supabase pets fetch error:', err);
      data = null;
    }

    // Fall back to Petfinder/mock search when Supabase isn't configured or returned null
    if (!data) data = await searchAnimals(params as SearchParams);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in pets API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pets', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
