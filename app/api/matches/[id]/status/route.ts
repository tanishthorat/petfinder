import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { status } = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .update({ status })
    .eq("id", params.id);

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
