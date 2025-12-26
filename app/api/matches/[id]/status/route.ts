import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { status } = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .update({ status })
    .eq("id", id);

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
