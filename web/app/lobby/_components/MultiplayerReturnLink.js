"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function MultiplayerReturnLink() {
  const searchParams = useSearchParams();

  // Preserve the current URL but modify search parameters
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.set("showLeaderboard", "");

  return (
    <Link href={`?${newSearchParams.toString()}`}>
      <b className="text-black">
        <span className="cursor-pointe">Return to join screen</span>
      </b>
    </Link>
  );
}
