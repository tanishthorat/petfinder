import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { recordSwipe } from "@/app/actions/pets";

export async function POST(request: Request) {
  try {
    const { petId, direction } = await request.json();
    const result = await recordSwipe(petId, direction);
    return NextResponse.json(result);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
