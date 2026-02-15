import { generateLast30Days } from "../game/calendarDays";
import { isDayUnlocked, isCompleted } from "../game/dailyUnlock";

export default function DailyAccess({ setSelectedDate }) {
  const days = generateLast30Days();

  return (
    <div className="grid grid-cols-6 gap-2 text-center text-sm mb-6">
      {days.map((date) => {
        const unlocked = isDayUnlocked(date);
        const done = isCompleted(date);

        return (
          <button
            key={date}
            disabled={!unlocked}
            onClick={() => unlocked && setSelectedDate(date)}
            className={`p-2 rounded-md border
              ${
                done
                  ? "bg-green-500 text-white"
                  : unlocked
                  ? "bg-white/10 border-white/20"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
          >
            {done ? "✔" : unlocked ? new Date(date).getDate() : "🔒"}
          </button>
        );
      })}
    </div>
  );
}
