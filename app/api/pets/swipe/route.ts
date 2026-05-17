import { NextResponse } from "next/server";
import { getPetsForSwiping } from "@/app/actions/pets";

export async function GET() {
  try {
    const pets = await getPetsForSwiping();
    return NextResponse.json(pets);
  } catch (error: any) {
    console.error("Error fetching pets for swiping:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch pets" },
      { status: 500 }
    );
  }
}

// Prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

