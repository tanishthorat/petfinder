import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getLikedPets } from "@/app/actions/pets";

export async function GET() {
  try {
    const likedPets = await getLikedPets();
    return NextResponse.json(likedPets);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
