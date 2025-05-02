import { KTLeaderboard } from "@/components/kt-leaderboard";
import { getServerSideData } from "@/components/kt-leaderboard/get-server-side-data";

export default async function Home() {
  const initialData = await getServerSideData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <KTLeaderboard initialData={initialData} />
    </div>
  );
}
