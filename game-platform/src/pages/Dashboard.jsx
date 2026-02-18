import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { getUserActivity } from "../storage/activityDB";
import { getStreak } from "../game/streak";

export default function Dashboard() {
  const user = auth.currentUser;
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await getUserActivity(user.uid);
      setActivity(data);
    }

    load();
  }, [user]);

  // ---------- BASIC ----------
  const totalSessions = activity.length;
  const solvedSessions = activity.filter(a => a.solved).length;
  const wrongSessions = activity.filter(a => !a.solved).length;

  // ---------- ACCURACY ----------
  const accuracy =
    totalSessions === 0
      ? 0
      : Math.round((solvedSessions / totalSessions) * 100);

  // ---------- SCORE ----------
  const totalScore = activity.reduce((s, a) => s + (a.score || 0), 0);
  const bestScore = Math.max(0, ...activity.map(a => a.score || 0));

  // ---------- TIME ----------
  const avgTime =
    solvedSessions === 0
      ? 0
      : Math.round(
          activity
            .filter(a => a.solved)
            .reduce((s, a) => s + (a.timeTaken || 0), 0) / solvedSessions
        );

  const fastestTime =
    solvedSessions === 0
      ? 0
      : Math.min(...activity.filter(a => a.solved).map(a => a.timeTaken || 999));

  // ---------- DIFFICULTY ----------
  const highestDifficulty =
    activity.length === 0
      ? 0
      : Math.max(...activity.map(a => a.difficulty || 0));

  // ---------- WEEKLY ----------
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);

  const weeklyPlays = activity.filter(
    a => new Date(a.date) >= weekAgo
  ).length;

  // ---------- STREAK ----------
  const streak = getStreak();

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 shadow-xl">
          <h1 className="text-3xl font-bold">📊 Player Analytics</h1>
          <p className="text-gray-300">
            Performance insights for {user?.displayName}
          </p>
        </div>

        {/* MAIN STATS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Stat title="🔥 Current Streak" value={`${streak} days`} />
          <Stat title="🎯 Accuracy" value={`${accuracy}%`} />
          <Stat title="🎮 Sessions Played" value={totalSessions} />
          <Stat title="✅ Solved" value={solvedSessions} />
          <Stat title="❌ Wrong Attempts" value={wrongSessions} />
          <Stat title="🏆 Best Score" value={bestScore} />
        </div>

        {/* PERFORMANCE */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Stat title="⚡ Fastest Solve" value={`${fastestTime}s`} />
          <Stat title="⏱ Avg Solve Time" value={`${avgTime}s`} />
          <Stat title="📈 Highest Difficulty" value={highestDifficulty} />
        </div>

        {/* ENGAGEMENT */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="📅 Weekly Activity">
            <p className="text-3xl font-bold">{weeklyPlays}</p>
            <p className="text-gray-400 text-sm">sessions this week</p>
          </Card>

          <Card title="💯 Total Score">
            <p className="text-3xl font-bold">{totalScore}</p>
            <p className="text-gray-400 text-sm">points earned</p>
          </Card>
        </div>

      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl shadow-lg">
      <p className="text-gray-300 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl shadow-lg">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
