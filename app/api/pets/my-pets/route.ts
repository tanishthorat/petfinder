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
    .from("pets")
    .select("*")
    .eq("owner_id", user.id);

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
