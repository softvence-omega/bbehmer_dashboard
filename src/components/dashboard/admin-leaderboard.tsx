import { useEffect } from 'react';
import { useAdminLeaderboardQuery } from '../../redux/features/admin/adminAnalytics';

export default function AdminLeaderboard() {
  // Fetch leaderboard (default: current month)
  const { data, isLoading, isError } = useAdminLeaderboardQuery({
    type: 'month',
    skip: 1,
    take: 10,
  });

  useEffect(() => {
    if (data) {
      console.log('Leaderboard data:', data);
    }
  }, [data]);

  if (isLoading) return <div>Loading leaderboard...</div>;
  if (isError) return <div>Error loading leaderboard.</div>;

  return (
    <div>
      <h1>Admin Leaderboard</h1>
      {/* Optional: simple table or raw output */}
      <pre>{JSON.stringify(data?.data, null, 2)}</pre>
    </div>
  );
}
