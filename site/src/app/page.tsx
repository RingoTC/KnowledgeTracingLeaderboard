"use client";

import { KTLeaderboard } from "@/components/kt-leaderboard";
import { leaderboardData } from "@/data/generated";

export default function Home() {
  return (
    <div className="space-y-6">
      <KTLeaderboard data={leaderboardData} />
    </div>
  );
}
