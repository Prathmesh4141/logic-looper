import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import Heatmap from "../components/Heatmap";

export default function Profile() {
  const [history, setHistory] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    fetch(`https://logic-looper-api.onrender.com/user-history/${user.displayName}`)
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  const bestScore = history.length
    ? Math.max(...history.map((h) => h.score))
    : 0;
  const totalGames = history.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl mb-6">
          <h1 className="text-3xl font-bold">👤 {user.displayName}</h1>
          <p className="text-gray-300">Welcome back to Logic Looper</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 p-5 rounded-xl backdrop-blur-lg shadow">
            <p className="text-gray-300">🏆 Best Score</p>
            <h2 className="text-3xl font-bold">{bestScore}</h2>
          </div>

          <div className="bg-white/10 p-5 rounded-xl backdrop-blur-lg shadow">
            <p className="text-gray-300">🎮 Total Plays</p>
            <h2 className="text-3xl font-bold">{totalGames}</h2>
          </div>

          <div className="bg-white/10 p-5 rounded-xl backdrop-blur-lg shadow">
            <p className="text-gray-300">📅 Active Player</p>
            <h2 className="text-3xl font-bold">Yes</h2>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl mb-6">
          <h2 className="text-2xl font-semibold mb-4">🧾 Recent Sessions</h2>

          <div className="space-y-3">
            {history.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg hover:bg-white/10 transition"
              >
                <span className="font-medium">Score: {item.score}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}

            {history.length === 0 && (
              <p className="text-gray-400">No games played yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">📅 Activity</h2>
          <div className="overflow-x-auto">
            <div className="w-fit mx-auto">
              <Heatmap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
