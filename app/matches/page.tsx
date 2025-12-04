import React from "react";
import { getMatches } from "@/app/actions";
import MatchesList from "@/components/MatchesList";

export default async function MatchesPage() {
  const matches = await getMatches();

  return <MatchesList matches={matches as any} />;
}
