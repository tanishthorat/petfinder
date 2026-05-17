import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", user.id);

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
