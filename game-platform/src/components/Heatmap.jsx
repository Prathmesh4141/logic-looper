import { getActivityData } from "../game/activity";

export default function Heatmap() {
  const activity = getActivityData();

  const CELL = 12;
  const GAP = 3;

  const today = new Date();


  const startDate = new Date(today.getFullYear(), 0, 1);

  const days = [];
  const months = [];

  let lastMonth = -1;

  
const endDate = new Date(today.getFullYear(), 11, 31);

const totalDays =
  Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;


  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const key = d.toISOString().split("T")[0];

    const played = activity[key] === true;

    days.push({
      date: key,
      played,
      month: d.getMonth(),
    });

    if (d.getMonth() !== lastMonth) {
      months.push({
        index: i,
        label: d.toLocaleString("default", { month: "short" }),
      });
      lastMonth = d.getMonth();
    }
  }

  return (
    <div className="text-white overflow-x-auto">
      {/* MONTH LABELS */}
      <div className="relative mb-2" style={{ height: "16px" }}>
        {months.map((m, i) => (
          <span
            key={i}
            className="absolute text-xs text-gray-400"
            style={{
              left: `${(m.index / 7) * (CELL + GAP + 2)}px`,
            }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div
        className="grid"
        style={{
          gridAutoFlow: "column",
          gridTemplateRows: `repeat(7, ${CELL}px)`,
          gap: `${GAP}px`,
        }}
      >
        {days.map((day, i) => (
          <div
            key={i}
            title={day.date}
            style={{
              width: CELL,
              height: CELL,
              borderRadius: "2px",

              backgroundColor: day.played
                ? "#22c55e"
                : "#1f2937",

              marginRight:
                i > 0 &&
                day.month !== days[i - 1].month
                  ? "6px"
                  : "0px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
