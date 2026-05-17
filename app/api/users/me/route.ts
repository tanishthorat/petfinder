import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = await createClient();
  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(userData);
}

export async function PUT(request: Request) {
  const user = await getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update(body)
    .eq("id", user.id);

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
