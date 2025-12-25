import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getMatchDetails } from "@/app/actions/messages";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchDetails = await getMatchDetails(params.id);
    return NextResponse.json(matchDetails);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
