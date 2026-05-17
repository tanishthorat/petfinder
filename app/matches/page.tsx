import React from "react";
import MatchesClient from "./MatchesClient";
import { getMatches } from "@/app/actions/matches";

export default async function MatchesPage() {
  const matches = await getMatches();

  return <MatchesClient initialMatches={matches || []} />;
}
