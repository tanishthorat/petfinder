import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getMatches } from "@/app/actions/matches";

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json(matches);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
