import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server-client";
import { getMyPets } from "@/app/actions/pets";
import MyPetsClient from "./MyPetsClient";

export default async function MyPetsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const pets = await getMyPets();

  return <MyPetsClient initialPets={pets} />;
}

