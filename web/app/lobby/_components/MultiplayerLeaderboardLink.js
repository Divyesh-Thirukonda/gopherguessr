"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function MultiplayerLeaderboardLink() {
  const searchParams = useSearchParams();

  // Preserve the current URL but modify search parameters
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.set("showLeaderboard", "1");

  return (
    <Link href={`?${newSearchParams.toString()}`}>
      <u>
        <span className="cursor-pointer">View Current Leaderboard</span>
      </u>
    </Link>
  );
}
