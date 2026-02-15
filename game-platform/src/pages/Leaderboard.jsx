import { useEffect, useState } from "react";
import { auth } from "../services/firebase";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser?.displayName;

  const loadLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/leaderboard");
      const data = await res.json();
      setPlayers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading leaderboard", err);
    }
  };

  useEffect(() => {
    loadLeaderboard();

    const refresh = () => loadLeaderboard();
    window.addEventListener("scoreUpdated", refresh);

    return () => window.removeEventListener("scoreUpdated", refresh);
  }, []);

  const medal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>

        {loading ? (
          <p className="text-center text-gray-300">Loading rankings...</p>
        ) : players.length === 0 ? (
          <p className="text-center text-gray-400">No scores yet.</p>
        ) : (
          <div className="space-y-3">
            {players.map((player, index) => {
              const isYou = player.username === currentUser;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition
                  ${
                    isYou
                      ? "bg-indigo-500/40 border border-indigo-300"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold w-8 text-center">
                      {medal(index)}
                    </span>

                    <span className="text-lg">
                      {player.username}
                      {isYou && (
                        <span className="ml-2 text-sm text-indigo-200">
                          (You)
                        </span>
                      )}
                    </span>
                  </div>

                  <span className="text-xl font-semibold">{player.score}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
