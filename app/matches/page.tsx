import React from "react";
import { getMatches } from "@/app/actions/matches";
import MatchesClient from "./MatchesClient";

export default async function MatchesPage() {
  const matches = await getMatches();

  return <MatchesClient matches={matches} />;
}
