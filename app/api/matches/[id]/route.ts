import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getMatchDetails } from "@/app/actions/messages";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchDetails = await getMatchDetails(id);
    return NextResponse.json(matchDetails);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
