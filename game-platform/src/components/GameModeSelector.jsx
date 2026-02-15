export default function GameModeSelector({ mode, setMode }) {
    const modes = ["daily", "blitz", "practice", "challenge"];
  
    return (
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-lg text-sm capitalize
            ${mode === m
              ? "bg-indigo-500 text-white"
              : "bg-white/10 text-gray-300"}`}
          >
            {m}
          </button>
        ))}
      </div>
    );
  }
  