import { useState, useMemo } from "react";
import { getActivityData } from "../game/activity";

export default function GitHubHeatmap() {
  const activity = getActivityData();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  const { days, monthLabels, totalWeeks } = useMemo(() => {
    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);

    const firstDayOffset = start.getDay();
    const days = [];
    const labels = [];

    // placeholders for first week alignment
    for (let i = 0; i < firstDayOffset; i++) {
      days.push({ placeholder: true });
    }

    let current = new Date(start);

    while (current <= end) {
      const key = current.toISOString().split("T")[0];

      if (current.getDate() === 1) {
        labels.push({
          name: current.toLocaleString("default", { month: "short" }),
          weekIndex: Math.floor(days.length / 7),
        });
      }

      days.push({
        date: key,
        played: activity[key] === true,
        placeholder: false,
      });

      current.setDate(current.getDate() + 1);
    }

    const totalWeeks = Math.ceil(days.length / 7);

    return { days, monthLabels: labels, totalWeeks };
  }, [selectedYear, activity]);

  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] p-4 rounded-md border border-[#30363d] inline-block font-sans">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm">
          Activity in {selectedYear}
        </span>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[#161b22] border border-[#30363d] text-xs rounded px-2 py-1"
        >
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex">
        {/* WEEKDAY LABELS */}
        <div className="flex flex-col justify-between text-[10px] pr-2 pt-6 text-[#8b949e]">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div>
          {/* MONTH LABELS */}
          <div className="relative h-5 mb-1 text-[10px] text-[#8b949e]">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="absolute"
                style={{
                  left: `${m.weekIndex * 14}px`,
                }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* GRID */}
          <div
            className="grid grid-rows-7 grid-flow-col gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${totalWeeks}, 11px)`
            }}
          >
            {days.map((day, i) => {
              const weekIndex = Math.floor(i / 7);

              // detect start of a month
              const monthStart = monthLabels.find(
                m => m.weekIndex === weekIndex
              );

              return (
                <div
                  key={i}
                  title={day.placeholder ? "" : day.date}
                  className="w-[11px] h-[11px] rounded-[2px]"
                  style={{
                    backgroundColor: day.placeholder
                      ? "transparent"
                      : day.played
                      ? "#39d353"
                      : "#161b22",
                    border: day.placeholder
                      ? "none"
                      : "1px solid rgba(27,31,35,0.06)",

                    /* ⭐ CLEAN MONTH GAP */
                    marginLeft: monthStart && i % 7 === 0 ? "10px" : "0px",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex items-center justify-end gap-1 mt-4 text-[10px] text-[#8b949e]">
        <span>Less</span>
        <div className="w-[11px] h-[11px] bg-[#161b22] rounded-[2px]"></div>
        <div className="w-[11px] h-[11px] bg-[#0e4429] rounded-[2px]"></div>
        <div className="w-[11px] h-[11px] bg-[#006d32] rounded-[2px]"></div>
        <div className="w-[11px] h-[11px] bg-[#26a641] rounded-[2px]"></div>
        <div className="w-[11px] h-[11px] bg-[#39d353] rounded-[2px]"></div>
        <span>More</span>
      </div>
    </div>
  );
}
