import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({ user_id: user.id, ...body }, { onConflict: "user_id" });

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
