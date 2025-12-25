import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = await createClient();
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (userError || !user) return new NextResponse("User not found", { status: 404 });

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await request.json();
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (userError || !user) return new NextResponse("User not found", { status: 404 });

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({ user_id: user.id, ...body }, { onConflict: "user_id" });

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
