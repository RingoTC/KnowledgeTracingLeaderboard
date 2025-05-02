import { KTLeaderboard } from "@/components/kt-leaderboard";
import { getServerSideData } from "@/components/kt-leaderboard/get-server-side-data";

export default async function Home() {
  const initialData = await getServerSideData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <KTLeaderboard initialData={initialData} />
    </main>
  );
}
