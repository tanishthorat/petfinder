import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getSwipeHistory } from "@/app/actions/pets";

export async function GET() {
  try {
    const history = await getSwipeHistory();
    return NextResponse.json(history);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
